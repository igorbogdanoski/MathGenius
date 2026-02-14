
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TeacherDashboard from './components/TeacherDashboard';
import LessonMap from './components/LessonMap';
import ActiveLesson from './components/ActiveLesson';
import { UserProvider, useUser } from './context/UserContext';
import { LessonProvider } from './context/LessonContext';

// Simple Error Boundary for easier debugging of white screens
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRITICAL UI ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 text-center font-sans">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6">The application crashed. This usually happens due to a data sync error or missing configuration.</p>
            <pre className="bg-red-100 p-4 rounded-lg text-xs text-red-800 text-left overflow-auto max-h-40 mb-6">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
            >
              Reset Data & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
        <UserProvider>
            <MainRouter />
        </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
