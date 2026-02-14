
import { UserState, StudentProfile, Problem } from '../types';
import { SAMPLE_LESSON } from '../constants';
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const STORAGE_KEY_USER = 'mathGeniusState';
const STORAGE_KEY_CUSTOM_CONTENT = 'mathGeniusCustomContent';

// Helper to generate a fake class roster for demo purposes
const generateMockStudents = (currentUser?: UserState): StudentProfile[] => {
  const baseStudents: StudentProfile[] = [
    { 
      id: 's1', name: 'Marko P.', avatar: '👨‍🎓', overallMastery: 92, status: 'Advanced', 
      weakestTopic: 'None', strongestTopic: 'Graphing', lastActive: '2 mins ago',
      history: [
        { problemId: '11.1', topic: 'Functions', correct: true, timeSpent: 45 },
        { problemId: '11.2', topic: 'Plotting', correct: true, timeSpent: 120 }
      ]
    },
    { 
      id: 's2', name: 'Ana J.', avatar: '👩‍🎓', overallMastery: 78, status: 'On Track', 
      weakestTopic: 'Gradient', strongestTopic: 'Functions', lastActive: '1 hour ago',
      history: []
    },
    { 
      id: 's3', name: 'David S.', avatar: '🧑‍💻', overallMastery: 45, status: 'At Risk', 
      weakestTopic: 'Plotting', strongestTopic: 'Basic Algebra', lastActive: '5 mins ago',
      history: [
        { problemId: '11.2', topic: 'Plotting', correct: false, timeSpent: 15 }
      ]
    }
  ];

  if (currentUser) {
    const currentStudent: StudentProfile = {
      id: 'current_user',
      name: 'You (Current Device)',
      avatar: currentUser.equipped.avatar,
      overallMastery: Math.min(100, currentUser.masteryPoints / 10),
      status: currentUser.path === 'Challenge' ? 'Advanced' : currentUser.path === 'Focus' ? 'At Risk' : 'On Track',
      weakestTopic: 'Calculating...',
      strongestTopic: 'Calculating...',
      lastActive: 'Now',
      history: currentUser.history.map(h => ({
        problemId: h.problemId,
        topic: h.problemId.split('_')[0],
        correct: h.correct,
        timeSpent: 60
      }))
    };
    return [currentStudent, ...baseStudents];
  }

  return baseStudents;
};

class DataService {
  
  // --- USER PERSISTENCE (HYBRID: FIREBASE + LOCAL) ---

  async saveUserState(state: UserState): Promise<void> {
    // 1. Always save to LocalStorage
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state));
    } catch (e) {
      console.error("Local save failed", e);
    }

    // 2. If Firebase is connected, sync to Cloud
    if (db) {
      try {
        // Use the actual user ID from the state
        const userId = state.userId || 'guest_user'; 
        const userRef = doc(db, 'users', userId);
        
        // Prepare data for teacher dashboard (StudentProfile compatibility)
        const profileUpdate = {
            ...state,
            id: userId,
            name: state.name || 'Anonymous Student',
            avatar: state.equipped.avatar,
            overallMastery: Math.min(100, state.masteryPoints / 10),
            status: state.path === 'Challenge' ? 'Advanced' : state.path === 'Focus' ? 'At Risk' : 'On Track',
            lastActive: new Date().toISOString()
        };

        await setDoc(userRef, profileUpdate, { merge: true });
      } catch (e) {
        console.warn("Cloud save failed", e);
      }
    }
  }

  async loadUserState(userId: string = 'guest_user'): Promise<UserState | null> {
    // 1. Try to load from Cloud first
    if (db) {
        try {
            const userRef = doc(db, 'users', userId);
            const snapshot = await getDoc(userRef);
            if (snapshot.exists()) {
                const cloudData = snapshot.data() as UserState;
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(cloudData));
                return cloudData;
            }
        } catch (e) {
            console.warn("Cloud load failed", e);
        }
    }

    // 2. Fallback to LocalStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Local load failed", e);
      return null;
    }
  }

  // --- TEACHER DASHBOARD DATA ---
  
  async getClassRoster(): Promise<StudentProfile[]> {
    if (db) {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const students: StudentProfile[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                students.push({
                    id: doc.id,
                    name: data.name || 'Anonymous',
                    avatar: data.equipped?.avatar || '👤',
                    overallMastery: data.overallMastery || (data.masteryPoints ? Math.min(100, data.masteryPoints / 10) : 0),
                    status: data.status || 'On Track',
                    weakestTopic: data.weakestTopic || 'N/A',
                    strongestTopic: data.strongestTopic || 'N/A',
                    lastActive: (() => {
                        try {
                            return data.lastActive ? new Date(data.lastActive).toLocaleTimeString() : 'Unknown';
                        } catch(e) { return 'Just now'; }
                    })(),
                    history: data.history || []
                });
            });
            return students;
        } catch (e) {
            console.error("Failed to fetch roster", e);
        }
    }
    
    // Fallback to mock data if DB fails
    const currentUserState = await this.loadUserState();
    return generateMockStudents(currentUserState || undefined);
  }

  // --- CMS / CONTENT MANAGEMENT ---

  saveCustomProblem(problem: Problem): void {
    // Save locally
    const existing = this.getCustomProblemsLocal();
    const updated = [...existing, problem];
    localStorage.setItem(STORAGE_KEY_CUSTOM_CONTENT, JSON.stringify(updated));

    // Save to Cloud (Collection: 'custom_problems')
    if (db) {
        try {
            const problemRef = doc(db, 'custom_problems', problem.id);
            setDoc(problemRef, problem);
        } catch (e) {
            console.error("Cloud problem save failed", e);
        }
    }
  }

  getCustomProblemsLocal(): Problem[] {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_CONTENT);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
  }

  async getCustomProblems(): Promise<Problem[]> {
    // Try Cloud
    if (db) {
        try {
            const querySnapshot = await getDocs(collection(db, "custom_problems"));
            const problems: Problem[] = [];
            querySnapshot.forEach((doc) => {
                problems.push(doc.data() as Problem);
            });
            if (problems.length > 0) return problems;
        } catch (e) {
            // Fallback
        }
    }
    return this.getCustomProblemsLocal();
  }

  async getLeaderboard(): Promise<StudentProfile[]> {
    if (!db) return [];
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const students: StudentProfile[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            students.push({
                id: doc.id,
                name: data.name || 'Anonymous',
                avatar: data.equipped?.avatar || '👤',
                overallMastery: data.overallMastery || (data.masteryPoints ? Math.min(100, data.masteryPoints / 10) : 0),
                status: data.status || 'On Track',
                weakestTopic: data.weakestTopic || 'N/A',
                strongestTopic: data.strongestTopic || 'N/A',
                lastActive: 'Active',
                history: []
            });
        });
        // Sort by mastery points descending
        return students.sort((a, b) => b.overallMastery - a.overallMastery).slice(0, 10);
    } catch (e) {
        console.error("Leaderboard fetch failed", e);
        return [];
    }
  }

  getLessonContent(lessonId: string): Problem[] {
    // Note: This function remains synchronous for now to avoid breaking UI render loops.
    // Ideally, the LessonContext should handle async loading.
    // For now, we rely on the fact that we might have loaded custom problems into memory or local storage.
    
    const staticProblems = SAMPLE_LESSON.problems;
    const customProblems = this.getCustomProblemsLocal(); // Use local sync version for speed
    
    const allProblems = [...staticProblems, ...customProblems];

    if (lessonId === 'Start') {
        return allProblems.filter(p => p.lessonId === 'Start');
    }

    return allProblems.filter(p => p.lessonId === lessonId || p.lessonId === `${lessonId}_WB`);
  }
}

export const dataService = new DataService();
