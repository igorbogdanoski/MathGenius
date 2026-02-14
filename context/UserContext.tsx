
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
  equipItem: (type: 'avatar' | 'accessory' | 'theme', value: string | null) => void;
  setLanguage: (lang: Language) => void;
  registerUser: (lang: Language, name: string) => void;
  completeLessonDiagnostic: (newPath: 'Focus' | 'Practice' | 'Challenge') => void;
  markLessonComplete: (lessonId: string) => void;
  isLoading: boolean;
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
    equipped: { avatar: '🧑‍🎓', accessory: null, theme: 'bg-slate-50' }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load (Async)
  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        // Check local storage for an existing userId first
        const localRaw = localStorage.getItem('mathGeniusState');
        let existingId = 'guest_user';
        if (localRaw) {
            try {
                const parsed = JSON.parse(localRaw);
                if (parsed.userId) existingId = parsed.userId;
            } catch(e){}
        }

        const saved = await dataService.loadUserState(existingId);
        if (saved) {
             // Migration checks
             if (!saved.userId) saved.userId = `user_${Math.random().toString(36).substr(2, 9)}`;
             if (!saved.inventory) saved.inventory = DEFAULT_STATE.inventory;
             if (!saved.completedLessons) saved.completedLessons = [];
             setUserState(saved);
        } else {
             // Create new user with unique ID
             const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
             setUserState(prev => ({ ...prev, userId: newId }));
        }
        setIsLoading(false);
    };
    init();
  }, []);

  // Persistence Effect (Save on change)
  useEffect(() => {
    if (!isLoading) {
        dataService.saveUserState(userState);
    }
  }, [userState, isLoading]);

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

  return (
    <UserContext.Provider value={{ 
      userState, 
      updateUser, 
      addMasteryPoints, 
      incrementStreak, 
      resetStreak, 
      unlockItem, 
      equipItem,
      setLanguage,
      registerUser,
      completeLessonDiagnostic,
      markLessonComplete,
      isLoading
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
