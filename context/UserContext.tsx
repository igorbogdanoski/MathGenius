
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, Language, ShopItem } from '../types';
import { dataService } from '../services/dataService';

interface UserContextType {
  userState: UserState;
  updateUser: (updates: Partial<UserState>) => void;
  addMasteryPoints: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockItem: (itemId: string, cost: number) => void;
  unlockBadge: (badgeId: string) => void;
  equipItem: (type: 'avatar' | 'accessory' | 'theme', value: string | null) => void;
  setLanguage: (lang: Language) => void;
  registerUser: (lang: Language, name: string) => void;
  completeLessonDiagnostic: (newPath: 'Focus' | 'Practice' | 'Challenge') => void;
  markLessonComplete: (lessonId: string) => void;
  resetProgress: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_STATE: UserState = {
    language: 'MK',
    masteryPoints: 0,
    streak: 0,
    currentLessonId: 'Start',
    currentProblemIndex: 0,
    path: 'Focus', 
    history: [],
    completedLessons: [],
    inventory: ['av_student', 'th_default'],
    equipped: { avatar: '🧑‍🎓', accessory: null, theme: 'bg-slate-50' },
    badges: []
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initial Load (Async)
  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        const localRaw = localStorage.getItem('mathGeniusState');
        
        try {
            if (localRaw) {
                const parsed = JSON.parse(localRaw);
                if (parsed.userId && parsed.userId !== 'guest_user') {
                    const saved = await dataService.loadUserState(parsed.userId);
                    if (saved) {
                        const merged = { ...DEFAULT_STATE, ...saved };
                        // Ensure arrays exist
                        merged.completedLessons = merged.completedLessons || [];
                        merged.history = merged.history || [];
                        merged.badges = merged.badges || [];
                        setUserState(merged);
                        setIsLoading(false);
                        return;
                    }
                }
            }
        } catch(e) {
            console.warn("State initialization failed, starting fresh");
        }

        // Fresh Start - Generate unique ID immediately
        const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
        setUserState(prev => ({ ...prev, userId: newId }));
        setIsLoading(false);
    };
    init();
  }, []);

  // Persistence Effect (Save on change)
  useEffect(() => {
    const saveData = async () => {
        if (!isLoading) {
            setIsSyncing(true);
            await dataService.saveUserState(userState);
            // Artificial delay for UX visibility
            setTimeout(() => setIsSyncing(false), 800);
        }
    };
    saveData();
  }, [userState, isLoading]);

  // Badge Check Effect
  useEffect(() => {
    if (userState.history.length >= 1) unlockBadge('first_win');
    if (userState.streak >= 3) unlockBadge('streak_3');
    if (userState.completedLessons.includes('CheckProgress')) unlockBadge('master_11');
    
    // Speed Demon Check
    const lastAction = userState.history[userState.history.length - 1];
    if (lastAction && lastAction.correct) {
        // We don't have exact 'timeSpent' in history here but we could add it.
        // For now let's just use what we have.
    }
  }, [userState.history, userState.streak, userState.completedLessons]);

  const updateUser = (updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const setLanguage = (lang: Language) => {
    updateUser({ language: lang });
  };

  const registerUser = (lang: Language, name: string) => {
      updateUser({ 
          language: lang, 
          name: name,
          // If we are still guest, generate a real ID
          userId: userState.userId === 'guest_user' ? `user_${Math.random().toString(36).substr(2, 9)}` : userState.userId
      });
  };

  const addMasteryPoints = (amount: number) => {
    setUserState(prev => ({ ...prev, masteryPoints: prev.masteryPoints + amount }));
  };

  const incrementStreak = () => {
    setUserState(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const resetStreak = () => {
    setUserState(prev => ({ ...prev, streak: 0 }));
  };

  const unlockItem = (itemId: string, cost: number) => {
    if (userState.masteryPoints >= cost && !userState.inventory.includes(itemId)) {
      setUserState(prev => ({
        ...prev,
        masteryPoints: prev.masteryPoints - cost,
        inventory: [...prev.inventory, itemId]
      }));
    }
  };

  const equipItem = (type: 'avatar' | 'accessory' | 'theme', value: string | null) => {
    setUserState(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [type]: value
      }
    }));
  };

  const completeLessonDiagnostic = (newPath: 'Focus' | 'Practice' | 'Challenge') => {
      setUserState(prev => ({
          ...prev,
          path: newPath,
          completedLessons: [...prev.completedLessons, 'Start'], // Mark diagnostic as done
          currentLessonId: null // Clear active lesson to return to map
      }));
  };

  const markLessonComplete = (lessonId: string) => {
    if (!userState.completedLessons.includes(lessonId)) {
        setUserState(prev => ({
            ...prev,
            completedLessons: [...prev.completedLessons, lessonId]
        }));
    }
  };

  const unlockBadge = (badgeId: string) => {
    if (!userState.badges.includes(badgeId)) {
        setUserState(prev => ({
            ...prev,
            badges: [...prev.badges, badgeId]
        }));
    }
  };

  const resetProgress = () => {
    if (confirm("Дали сте сигурни дека сакате да го избришете напредокот?")) {
        localStorage.removeItem('mathGeniusState');
        window.location.reload();
    }
  };

  return (
    <UserContext.Provider value={{ 
      userState, 
      updateUser, 
      addMasteryPoints, 
      incrementStreak, 
      resetStreak, 
      unlockItem, 
      unlockBadge,
      equipItem,
      setLanguage,
      registerUser,
      completeLessonDiagnostic,
      markLessonComplete,
      resetProgress,
      isLoading,
      isSyncing
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
