import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Problem, UserState } from '../types';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { validateGraph, areExpressionsEquivalent, analyzeLinearError } from '../services/mathSolver';
import { generateSimilarProblem, generateBossProblem } from '../services/geminiService';
import { useUser } from './UserContext';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

interface LessonContextType {
  activeLessonProblems: Problem[];
  currentProblem: Problem | null;
  currentProblemIndex: number;
  inputValues: Record<string, string>;
  graphPoints: any[];
  feedback: 'none' | 'correct' | 'incorrect';
  specificError: string | null;
  loadingVariation: boolean;
  loadingBoss: boolean;
  hasExplained: boolean;
  lessonComplete: boolean;
  
  // Actions
  startLesson: (lessonId: string) => void;
  setInputValues: (values: Record<string, string>) => void;
  setGraphPoints: (points: any[]) => void;
  checkAnswer: () => void;
  nextProblem: () => void;
  generateVariation: () => Promise<void>;
  exitLesson: () => void;
  continuePractice: () => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userState, updateUser, addMasteryPoints, incrementStreak, resetStreak, markLessonComplete } = useUser();
  
  const [activeLessonProblems, setActiveLessonProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [graphPoints, setGraphPoints] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [specificError, setSpecificError] = useState<string | null>(null);
  const [loadingVariation, setLoadingVariation] = useState(false);
  const [loadingBoss, setLoadingBoss] = useState(false);
  const [hasExplained, setHasExplained] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  const currentProblem = activeLessonProblems[currentProblemIndex] || null;

  // Initialize/Reset State when starting a lesson
  const startLesson = async (lessonId: string) => {
    if (lessonId === 'CheckProgress') {
        setLoadingBoss(true);
        const bossProb = await generateBossProblem(userState.history, userState.language);
        if (bossProb) {
          setActiveLessonProblems([bossProb]);
          setCurrentProblemIndex(0);
          setLessonComplete(false);
          resetProblemState();
          updateUser({ currentLessonId: lessonId, currentProblemIndex: 0 });
          setLoadingBoss(false);
          return;
        }
        setLoadingBoss(false);
    }

    let problems = dataService.getLessonContent(lessonId);

    if (problems.length === 0) {
      alert("No problems found for this lesson yet.");
      return;
    }

    // Adaptive Filtering
    if (lessonId !== 'Start') {
        problems = problems.filter(p => {
            if (userState.path === 'Focus') return p.difficulty !== 'Challenge';
            if (userState.path === 'Practice') return p.difficulty === 'Practice' || p.difficulty === 'Focus';
            return true; 
        });
    }

    const shuffled = shuffleArray(problems);
    setActiveLessonProblems(shuffled);
    setCurrentProblemIndex(0);
    setLessonComplete(false);
    resetProblemState();
    
    // Explicitly force index 0 in user state too
    updateUser({ 
        currentLessonId: lessonId, 
        currentProblemIndex: 0 
    });
  };

  const resetProblemState = () => {
    setFeedback('none');
    setSpecificError(null);
    setInputValues({});
    setGraphPoints([]);
    setHasExplained(false);
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    let isCorrect = false;
    let errorAnalysisMsg = null;

    if (currentProblem.type === 'table_completion') {
      const expected = currentProblem.correctAnswer as Record<string, number>;
      // Check if all keys match
      const allMatch = Object.keys(expected).every(k => {
         const val = inputValues[k];
         return val && parseFloat(val) === expected[k];
      });
      isCorrect = allMatch;
    } else if (currentProblem.type === 'graphing') {
       if (currentProblem.graphConfig && currentProblem.graphConfig.equation) {
         isCorrect = validateGraph(
            graphPoints, 
            currentProblem.graphConfig.equation, 
            currentProblem.graphConfig.requiredPoints
         );
       } else {
         isCorrect = graphPoints.length >= 2;
       }
    } else if (currentProblem.type === 'multiple_choice') {
       if (inputValues['mc'] === String(currentProblem.correctAnswer)) {
         isCorrect = true;
       }
    } else if (currentProblem.type === 'input') {
       const userVal = inputValues['main'] || '';
       const correctVal = String(currentProblem.correctAnswer);
       isCorrect = areExpressionsEquivalent(userVal, correctVal);

       if (!isCorrect) {
          errorAnalysisMsg = analyzeLinearError(userVal, correctVal, userState.language);
       }
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setSpecificError(errorAnalysisMsg);

    if (isCorrect) {
       soundService.playCorrect();
       
       let basePoints = userState.path === 'Challenge' ? 20 : 10;
       
       // Streak Multiplier
       if (userState.streak >= 5) basePoints += 10;
       else if (userState.streak >= 3) basePoints += 5;
       
       addMasteryPoints(basePoints);
       incrementStreak();
       
       // Record History
       updateUser({
         history: [...userState.history, {
            problemId: currentProblem.id,
            correct: true,
            timestamp: Date.now()
         }]
       });

    } else {
       soundService.playIncorrect();
       resetStreak();
       setHasExplained(true);

        updateUser({
         history: [...userState.history, {
            problemId: currentProblem.id,
            correct: false,
            timestamp: Date.now()
         }]
       });
    }
  };

  const nextProblem = () => {
    const nextIdx = currentProblemIndex + 1;
    
    if (nextIdx >= activeLessonProblems.length) {
        setLessonComplete(true);
        soundService.playSuccess();
        
        // Mark as complete in global state immediately
        if (userState.currentLessonId && userState.currentLessonId !== 'Start') {
            markLessonComplete(userState.currentLessonId);
        }
    } else {
        resetProblemState();
        setCurrentProblemIndex(nextIdx);
        updateUser({ currentProblemIndex: nextIdx });
    }
  };

  const generateVariation = async () => {
    if (!currentProblem) return;
    setLoadingVariation(true);
    const newProblem = await generateSimilarProblem(currentProblem, userState.language);
    if (newProblem) {
      const updatedProblems = [...activeLessonProblems];
      updatedProblems[currentProblemIndex] = newProblem;
      setActiveLessonProblems(updatedProblems);
      resetProblemState();
    }
    setLoadingVariation(false);
  };

  // Resets the lesson index but keeps the user in the lesson to solve again (or new variations)
  const continuePractice = () => {
      setLessonComplete(false);
      setCurrentProblemIndex(0);
      resetProblemState();
      // Optionally reshuffle here for variety
      setActiveLessonProblems(shuffleArray(activeLessonProblems));
  };

  const exitLesson = () => {
    setLessonComplete(false);
    updateUser({ currentLessonId: null });
  };

  return (
    <LessonContext.Provider value={{
      activeLessonProblems,
      currentProblem,
      currentProblemIndex,
      inputValues,
      graphPoints,
      feedback,
      specificError,
      loadingVariation,
      loadingBoss,
      hasExplained,
      lessonComplete,
      startLesson,
      setInputValues,
      setGraphPoints,
      checkAnswer,
      nextProblem,
      generateVariation,
      exitLesson,
      continuePractice
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};