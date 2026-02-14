
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TeacherDashboard from './components/TeacherDashboard';
import LessonMap from './components/LessonMap';
import ActiveLesson from './components/ActiveLesson';
import { UserProvider, useUser } from './context/UserContext';
import { LessonProvider } from './context/LessonContext';

const MainRouter = () => {
    const { userState, registerUser, isLoading } = useUser();
    const [view, setView] = useState<'WELCOME' | 'APP' | 'TEACHER'>('WELCOME');
    
    // Check if user has a name to skip welcome
    React.useEffect(() => {
        if (!isLoading && userState.name) {
            setView('APP');
        } else if (!isLoading && !userState.name) {
            setView('WELCOME');
        }
    }, [isLoading, userState.name]);

    const handleWelcomeStart = (lang: any, name: string) => {
        registerUser(lang, name);
        setView('APP');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Syncing with Cloud...</p>
                </div>
            </div>
        );
    }

    if (view === 'TEACHER') {
        return <TeacherDashboard onBack={() => setView('APP')} onExport={()=>{}} onImport={()=>{}} />;
    }

    if (view === 'WELCOME') {
        return <WelcomeScreen onStart={handleWelcomeStart} />;
    }

    // APP VIEW: Either Lesson Map or Active Lesson
    const isInLesson = userState.currentLessonId !== null && userState.currentLessonId !== 'Finished';

    if (isInLesson) {
        return (
            <LessonProvider>
                <ActiveLesson />
            </LessonProvider>
        );
    }

    return <LessonMap onEnterTeacherMode={() => setView('TEACHER')} />;
};

const App = () => {
  return (
    <UserProvider>
        <MainRouter />
    </UserProvider>
  );
};

export default App;
