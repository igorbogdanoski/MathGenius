import React, { useState } from 'react';
import { Map, ShoppingBag, Trophy, Flame, Brain, Check, Lock, PlayCircle, Star, Cloud, LayoutGrid, Beaker, Sparkles, RefreshCcw } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import AvatarShop from './AvatarShop';
import Leaderboard from './Leaderboard';
import GraphLab from './GraphLab';
import { useUser } from '../context/UserContext';
import { useLesson } from '../context/LessonContext';
import { UI_LABELS, BADGES } from '../constants';
import { Translation } from '../types';

interface Props {
  onEnterTeacherMode: () => void;
}

const LESSON_MAP: { id: string; title: Translation; desc: Translation }[] = [
  { 
    id: '11.1', 
    title: { MK: 'Линеарни Функции', EN: 'Linear Functions', SQ: 'Funksionet Lineare', TR: 'Doğrusal Fonksiyonlar' }, 
    desc: { MK: 'Формули и замена', EN: 'Formulas & substitution', SQ: 'Formulat dhe zëvendësimi', TR: 'Formüller ve yerleştirme' } 
  },
  { 
    id: '11.2', 
    title: { MK: 'Цртање Графици', EN: 'Plotting Graphs', SQ: 'Vizatimi i Grafikëve', TR: 'Grafik Çizimi' }, 
    desc: { MK: 'Цртање линии од табели', EN: 'Drawing lines from tables', SQ: 'Vizatimi i vijave nga tabelat', TR: 'Tablolardan çizgi çizme' } 
  },
  { 
    id: '11.3', 
    title: { MK: 'Градиент и Отсечок', EN: 'Gradient & Intercept', SQ: 'Gradienti dhe Ndërprerja', TR: 'Eğim ve Kesişim' }, 
    desc: { MK: 'Разбирање на y = mx + c', EN: 'Understanding y = mx + c', SQ: 'Kuptimi i y = mx + c', TR: 'y = mx + c Anlayışı' } 
  },
  { 
    id: '11.4', 
    title: { MK: 'Толкување Графици', EN: 'Interpreting Graphs', SQ: 'Interpretimi i Grafikëve', TR: 'Grafikleri Yorumlama' }, 
    desc: { MK: 'Примери од реалниот живот', EN: 'Real-world examples', SQ: 'Shembuj nga bota reale', TR: 'Gerçek dünya örnekleri' } 
  },
  { 
    id: 'CheckProgress', 
    title: { MK: 'Евалуација', EN: 'Assessment', SQ: 'Vlerësimi', TR: 'Değerlendirme' }, 
    desc: { MK: 'Мастер Задача - Unit 11', EN: 'Unit 11 Master Task', SQ: 'Detyrë Master - Unit 11', TR: 'Ünite 11 Usta Görevi' } 
  }
];

const LessonMap: React.FC<Props> = ({ onEnterTeacherMode }) => {
  const { userState, updateUser, setLanguage, resetProgress } = useUser();
  const { startLesson } = useLesson();
  const labels = UI_LABELS[userState.language];
  
  const [showShop, setShowShop] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleStartLesson = (lessonId: string) => {
    startLesson(lessonId);
  };

  const handleLogoClick = () => {
    if (logoClicks + 1 >= 3) {
      onEnterTeacherMode();
      setLogoClicks(0);
    } else {
      setLogoClicks(c => c + 1);
    }
  };

  const isLessonCompleted = (id: string) => userState.completedLessons.includes(id);

  let furthestUnlockedIndex = 0;
  if (isLessonCompleted('Start')) {
      for (let i = 0; i < LESSON_MAP.length; i++) {
          if (isLessonCompleted(LESSON_MAP[i].id)) {
              furthestUnlockedIndex = i + 1;
          } else {
              break; 
          }
      }
  }

  const isUnitComplete = isLessonCompleted('CheckProgress');

  return (
    <div className={`min-h-screen font-sans text-slate-800 ${userState.equipped?.theme || 'bg-slate-50'}`}>
         {showShop && (
           <AvatarShop 
             userState={userState} 
             onUpdateState={updateUser}
             onClose={() => setShowShop(false)}
           />
         )}

         {showLab && (
           <GraphLab 
             language={userState.language}
             onClose={() => setShowLab(false)}
           />
         )}

         <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2">
               <Map className="w-6 h-6 text-indigo-600" />
               <h1 className="font-bold text-lg">{labels.myLearningPath}</h1>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowLab(true)}
                  className="hidden md:flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-bold hover:bg-purple-100 transition shadow-sm"
                >
                  <Beaker className="w-4 h-4" /> Lab
                </button>

                <button 
                  onClick={() => setShowShop(true)}
                  className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold hover:bg-indigo-100 transition shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> {labels.shop}
                </button>

                <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                   <Trophy className="w-4 h-4 fill-yellow-500" /> <span>{userState.masteryPoints}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                   <Flame className="w-4 h-4 fill-orange-500" /> <span>{userState.streak}</span>
                </div>
                <button 
                  onClick={resetProgress}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Ресетирај напредок"
                >
                   <RefreshCcw className="w-4 h-4" />
                </button>
                <LanguageSelector currentLang={userState.language} onLanguageChange={setLanguage} />
                
                <button onClick={() => setShowShop(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xl relative shadow-sm hover:scale-110 transition-transform">
                   {userState.equipped.avatar}
                   {userState.equipped.accessory && <span className="absolute -top-1 -right-1 text-sm">{userState.equipped.accessory}</span>}
                </button>
            </div>
         </header>

         <main className="max-w-7xl mx-auto p-6 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side */}
                <div className="lg:col-span-8">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-slate-900">{labels.unitTitle}</h2>
                        <p className="text-slate-500">{labels.unitDesc}</p>
                    </div>
                    
                    <div className="space-y-6 relative">
                        <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-indigo-100 to-slate-100 rounded-full z-0"></div>

                        <div className="relative z-10">
                            <button 
                                onClick={() => handleStartLesson('Start')}
                                className="w-full bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-5 hover:shadow-md transition-all group hover:border-indigo-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-sm">
                                    <Brain className="w-7 h-7 text-indigo-600 group-hover:text-white" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-lg text-slate-800">{labels.diagnostic}</h3>
                                        {isLessonCompleted('Start') && <Check className="text-green-500 w-5 h-5" />}
                                    </div>
                                    <p className="text-sm text-slate-500">{labels.diagnosticDesc}</p>
                                </div>
                            </button>
                        </div>

                        {LESSON_MAP.map((lesson, idx) => {
                            const prevLessonId = idx === 0 ? 'Start' : LESSON_MAP[idx - 1].id;
                            const isLocked = !isLessonCompleted(prevLessonId);
                            const isDone = isLessonCompleted(lesson.id);
                            const isMasterTask = lesson.id === 'CheckProgress';

                            if (idx > furthestUnlockedIndex) return null;
                            
                            if (idx === furthestUnlockedIndex && isLocked) {
                                return (
                                    <div key={lesson.id} className="relative z-10 pl-2 opacity-50 blur-[1px]">
                                        <div className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-5 cursor-not-allowed">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center">
                                                <Cloud className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-400">{labels.lockedLesson}</h3>
                                                <p className="text-sm text-slate-400">{labels.lockedDesc}</p>
                                            </div>
                                            <Lock className="w-5 h-5 text-slate-300" />
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={lesson.id} className="relative z-10 pl-2 animate-fade-in-up">
                                    <button 
                                        disabled={isLocked}
                                        onClick={() => handleStartLesson(lesson.id)}
                                        className={`w-full p-5 rounded-2xl border flex items-center gap-5 transition-all text-left group relative ${
                                            isLocked ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed grayscale' 
                                            : isDone ? 'bg-green-50 border-green-200 hover:border-green-400'
                                            : isMasterTask ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 shadow-md transform hover:scale-[1.02]'
                                            : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                                            isLocked ? 'bg-slate-200' : isDone ? 'bg-green-100' : isMasterTask ? 'bg-yellow-100' : 'bg-white border-2 border-purple-100 group-hover:border-purple-500'
                                        }`}>
                                            {isLocked ? <Lock className="w-6 h-6 text-slate-400" /> 
                                            : isDone ? <Check className="w-6 h-6 text-green-600" />
                                            : isMasterTask ? <Star className="w-6 h-6 text-yellow-600 animate-pulse" />
                                            : <span className="font-bold text-lg text-purple-600 group-hover:scale-110 transition-transform">{idx + 1}</span>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isMasterTask ? (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{labels.masterTask}</span>
                                                ) : (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isLocked ? 'bg-slate-200 text-slate-500' : isDone ? 'bg-green-200 text-green-800' : 'bg-purple-100 text-purple-700'}`}>
                                                        {labels.lesson} {lesson.id}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-800">{lesson.title[userState.language]}</h3>
                                            <p className="text-sm text-slate-500">{lesson.desc[userState.language]}</p>
                                        </div>
                                        {!isLocked && !isDone && (
                                            <div className={`${isMasterTask ? 'bg-yellow-100' : 'bg-purple-50'} p-2 rounded-full group-hover:scale-110 transition-transform`}>
                                                <PlayCircle className={`w-5 h-5 ${isMasterTask ? 'text-yellow-600' : 'text-purple-600'}`} />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}

                        {isUnitComplete && (
                            <div className="relative z-10 pl-2 mt-8 animate-fade-in-up">
                                <div className="flex items-center gap-2 mb-4 justify-center">
                                    <div className="h-[2px] w-12 bg-slate-200"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labels.nextSection}</span>
                                    <div className="h-[2px] w-12 bg-slate-200"></div>
                                </div>
                                <button disabled className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center gap-5 opacity-75">
                                    <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg text-slate-600">{labels.unit12Title}</h3>
                                        <p className="text-sm text-slate-400">{labels.unit12Desc}</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {!isUnitComplete && (
                        <div className="mt-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                            <Cloud className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium uppercase tracking-widest opacity-50">{labels.hiddenFog}</p>
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Leaderboard />
                    
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5" /> Quick Stats
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                                <div className="text-[10px] uppercase font-bold text-indigo-100">Progress</div>
                                <div className="text-xl font-bold">{Math.round((furthestUnlockedIndex / LESSON_MAP.length) * 100)}%</div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                                <div className="text-[10px] uppercase font-bold text-indigo-100">Mastery</div>
                                <div className="text-xl font-bold">{userState.masteryPoints}</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="text-[10px] uppercase font-bold text-indigo-100 mb-3">Your Badges</div>
                            <div className="flex flex-wrap gap-2">
                                {BADGES.map(badge => {
                                    const isEarned = userState.badges.includes(badge.id);
                                    return (
                                        <div 
                                            key={badge.id}
                                            title={`${badge.name}: ${badge.criteria}`}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                                                isEarned ? 'bg-white/20 scale-110 shadow-lg' : 'bg-black/20 opacity-30 grayscale'
                                            }`}
                                        >
                                            {badge.icon}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={handleLogoClick}
                className="text-xs text-slate-300 hover:text-slate-400 transition-colors"
              >
                MathGenius v1.0 • Built for Education
              </button>
            </div>
         </main>
      </div>
  );
};

export default LessonMap;
