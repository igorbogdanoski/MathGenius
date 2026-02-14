import React, { useRef, useEffect } from 'react';
import { Map, Flame, Trophy, Star, Check, X, Info, RefreshCcw, ChevronRight, Home, Repeat, Volume2, Cloud, CloudCheck, Sparkles } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import InteractiveGraph from './InteractiveGraph';
import SlopeVisualizer from './SlopeVisualizer';
import AITutor from './AITutor';
import AIIllustration from './AIIllustration';
import MathRenderer from './MathRenderer';
import VoiceInput from './VoiceInput';
import { useUser } from '../context/UserContext';
import { useLesson } from '../context/LessonContext';
import { UI_LABELS } from '../constants';
import { soundService } from '../services/soundService';

// Internal Confetti Component
const Confetti = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const particles: any[] = [];
      const colors = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981'];
      
      for(let i=0; i<100; i++) {
         particles.push({
            x: canvas.width/2, 
            y: canvas.height/2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2
         });
      }
      
      let animationId: number;
      function animate() {
         if(!ctx || !canvas) return;
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            if(p.y > canvas.height) particles.splice(i, 1);
         });
         if(particles.length > 0) {
             animationId = requestAnimationFrame(animate);
         }
      }
      animate();
  
      return () => cancelAnimationFrame(animationId);
    }, []);
    
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
  };

const ActiveLesson: React.FC = () => {
  const { userState, setLanguage, completeLessonDiagnostic, isSyncing } = useUser();
  const { 
    currentProblem, 
    activeLessonProblems, 
    currentProblemIndex, 
    inputValues, 
    feedback, 
    specificError, 
    hasExplained, 
    loadingVariation, 
    loadingBoss,
    lessonComplete,
    startLesson, 
    setInputValues, 
    setGraphPoints, 
    checkAnswer, 
    nextProblem, 
    generateVariation, 
    exitLesson,
    continuePractice
  } = useLesson();

  const labels = UI_LABELS[userState.language];

  // Load lesson content if not loaded yet
  useEffect(() => {
    if (activeLessonProblems.length === 0 && userState.currentLessonId) {
      startLesson(userState.currentLessonId);
    }
  }, [userState.currentLessonId, activeLessonProblems.length]);

  // Handle Diagnostic Completion Logic
  useEffect(() => {
    if (lessonComplete && userState.currentLessonId === 'Start') {
       // Wait a bit then calc diagnostic
       const timer = setTimeout(() => {
           const diagnosticIds = activeLessonProblems.map(p => p.id);
           const solvedCount = diagnosticIds.filter(id => 
                userState.history.some(h => h.problemId === id && h.correct)
           ).length;
           const score = solvedCount / diagnosticIds.length;
           
           let newPath: 'Focus' | 'Practice' | 'Challenge' = 'Focus';
           if (score >= 0.8) newPath = 'Challenge';
           else if (score >= 0.5) newPath = 'Practice';
           
           completeLessonDiagnostic(newPath);
       }, 3000);
       return () => clearTimeout(timer);
    }
  }, [lessonComplete]);

  // COMPLETION SCREEN
  if (lessonComplete && userState.currentLessonId !== 'Start') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-600 font-sans p-4 relative overflow-hidden">
            <Confetti />
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl z-10 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{labels.completed}</h2>
                <p className="text-slate-500 mb-8">Lesson completed successfully! What would you like to do?</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={exitLesson}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <Home className="w-5 h-5" /> Finish & Return to Map
                    </button>
                    <button 
                        onClick={continuePractice}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <Repeat className="w-5 h-5" /> Keep Practicing (Extra Problems)
                    </button>
                </div>
            </div>
        </div>
      );
  }

  if (loadingBoss) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-6 text-center">
        <div className="flex flex-col items-center gap-6 max-w-sm">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-yellow-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic">Summoning the Boss...</h2>
            <p className="text-slate-400 font-medium leading-relaxed">Gemini AI is crafting a unique challenge based on your performance.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-800 ${userState.equipped?.theme || 'bg-slate-50'}`}>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={exitLesson} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm">
             <Map className="w-4 h-4" /> Map
          </button>
          
          <div className="flex items-center gap-4">
             {/* Sync Indicator */}
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                {isSyncing ? (
                    <div className="flex items-center gap-1.5 text-indigo-500 animate-pulse">
                        <Cloud className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Syncing...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Saved</span>
                    </div>
                )}
             </div>

             <div className="hidden sm:flex items-center gap-1 text-orange-500 font-bold bg-white border border-orange-100 px-3 py-1 rounded-full shadow-sm">
               <Flame className="w-4 h-4 fill-orange-500" />
               <span>{userState.streak}</span>
             </div>
             <div className="hidden sm:flex items-center gap-1 text-yellow-600 font-bold bg-white border border-yellow-100 px-3 py-1 rounded-full shadow-sm">
               <Trophy className="w-4 h-4 fill-yellow-500" />
               <span>{userState.masteryPoints}</span>
             </div>
             <LanguageSelector currentLang={userState.language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 pb-24">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentProblemIndex + 1) / activeLessonProblems.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               {/* Lesson Tag */}
               <div className="flex justify-between items-start mb-6">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  currentProblem.difficulty === 'Focus' ? 'bg-blue-100 text-blue-700' :
                  currentProblem.difficulty === 'Practice' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  {labels[currentProblem.difficulty.toLowerCase() as keyof typeof labels] || currentProblem.difficulty}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {currentProblem.id.includes('var') ? 'AI Variation' : `ID: ${currentProblem.lessonId}`}
                </span>
              </div>
              
              {/* Question Text */}
              <div className="flex items-start gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-800 flex-1">
                    <MathRenderer text={currentProblem.question[userState.language]} />
                </h2>
                <button 
                    onClick={() => soundService.speak(currentProblem.question[userState.language], userState.language)}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors shadow-sm active:scale-95 shrink-0"
                    title="Read Question"
                >
                    <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Dynamic Content Renderer */}
              <div className="mt-6">
                
                {currentProblem.type === 'table_completion' && (
                   <div className="overflow-x-auto pb-2">
                     <table className="min-w-[300px] mx-auto border-separate border-spacing-0 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                       <thead className="bg-slate-50">
                         <tr>
                           <th className="p-4 border-b border-slate-200 font-bold text-slate-600">x</th>
                           <th className="p-4 border-b border-slate-200 font-bold text-slate-600">y</th>
                         </tr>
                       </thead>
                       <tbody>
                         {Object.keys(currentProblem.correctAnswer as Record<string, number>)
                           .sort((a,b) => parseFloat(a) - parseFloat(b))
                           .map((key) => (
                             <tr key={key} className="hover:bg-slate-50 transition-colors">
                               <td className="p-3 border-b border-slate-100 border-r text-center font-bold text-slate-600 bg-slate-50/50">{key}</td>
                               <td className="p-3 border-b border-slate-100 text-center">
                                 <input 
                                   type="number" 
                                   className="w-24 p-2 bg-white border-2 border-slate-200 rounded-lg text-center font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                   placeholder="?"
                                   value={inputValues[key] || ''}
                                   onChange={(e) => setInputValues({...inputValues, [key]: e.target.value})}
                                   disabled={feedback !== 'none'}
                                 />
                               </td>
                             </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                )}

                {currentProblem.type === 'graphing' && (
                  <div className="flex justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                    <InteractiveGraph 
                      onPlotPoints={setGraphPoints}
                      targetEquation={currentProblem.graphConfig?.equation}
                      readOnly={feedback !== 'none'}
                    />
                  </div>
                )}

                {currentProblem.type === 'multiple_choice' && currentProblem.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentProblem.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValues({ mc: String(idx) })}
                        disabled={feedback !== 'none'}
                        className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
                          inputValues['mc'] === String(idx)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-sm ring-1 ring-indigo-500'
                            : 'border-slate-100 hover:border-indigo-200 text-slate-700 bg-white shadow-sm'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                             inputValues['mc'] === String(idx) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-500 border-slate-200'
                           }`}>
                             {String.fromCharCode(65 + idx)}
                           </div>
                           <MathRenderer text={opt[userState.language]} className="text-base" />
                         </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentProblem.type === 'input' && (
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wide">{labels.typeAnswer}</label>
                     <div className="flex gap-2 relative group">
                       <input 
                         type="text" 
                         className="w-full p-5 border-2 border-slate-200 rounded-2xl text-xl font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                         placeholder="e.g. y=2x+1"
                         value={inputValues['main'] || ''}
                         onChange={(e) => setInputValues({...inputValues, main: e.target.value})}
                         disabled={feedback !== 'none'}
                       />
                       {/* VOICE INPUT BUTTON */}
                       <div className="absolute right-2 top-2 bottom-2">
                           <VoiceInput 
                             language={userState.language}
                             onTranscript={(text) => setInputValues({...inputValues, main: text})}
                             disabled={feedback !== 'none'}
                           />
                       </div>
                     </div>
                   </div>
                )}
              </div>
            </div>

            {/* Interactive Tools based on Lesson */}
            {currentProblem.lessonId.startsWith('11.3') && (
               <SlopeVisualizer language={userState.language} />
            )}

            {/* Footer / Feedback Action */}
            <div className={`fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] transition-transform z-20`}>
               <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     {feedback === 'correct' && (
                        <div className="flex items-center gap-3 text-green-600 font-bold text-lg animate-fade-in-up">
                           <div className="bg-green-100 p-2 rounded-full ring-4 ring-green-50"><Check className="w-6 h-6" /></div>
                           <span className="hidden sm:inline">{labels.correct}</span>
                        </div>
                     )}
                     {feedback === 'incorrect' && (
                        <div className="flex flex-col animate-fade-in-up">
                            <div className="flex items-center gap-3 text-red-600 font-bold text-lg">
                                <div className="bg-red-100 p-2 rounded-full ring-4 ring-red-50"><X className="w-6 h-6" /></div>
                                <span className="hidden sm:inline">{labels.incorrect}</span>
                            </div>
                            {/* AI 2.0 SPECIFIC ERROR FEEDBACK */}
                            {specificError && (
                              <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-lg flex items-center gap-2 border border-red-100">
                                 <Info className="w-4 h-4 shrink-0" />
                                 <span>{specificError}</span>
                              </div>
                            )}
                        </div>
                     )}
                  </div>

                  <div className="flex gap-3">
                     {feedback === 'none' ? (
                       <button 
                         onClick={checkAnswer}
                         className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 w-full sm:w-auto"
                       >
                         {labels.submit}
                       </button>
                     ) : (
                       <div className="flex gap-3">
                         {/* If incorrect and AI logic allows, show "Try Similar" button (Level 3 Scaffolding) */}
                         {feedback === 'incorrect' && hasExplained && !loadingVariation && (
                            <button
                              onClick={generateVariation}
                              className="bg-purple-100 text-purple-700 px-6 py-4 rounded-2xl font-bold hover:bg-purple-200 transition flex items-center gap-2"
                            >
                              <RefreshCcw className="w-5 h-5" /> <span className="hidden sm:inline">Try Similar</span>
                            </button>
                         )}
                         {loadingVariation && (
                            <button disabled className="bg-slate-100 text-slate-400 px-6 py-4 rounded-2xl font-bold animate-pulse">
                               Generating...
                            </button>
                         )}
                         
                         <button 
                           onClick={nextProblem}
                           className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 active:scale-95"
                         >
                           {labels.next} <ChevronRight className="w-6 h-6" />
                         </button>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
             {/* AI Illustrator */}
             {currentProblem.illustration_description && (
                <AIIllustration description={currentProblem.illustration_description} />
             )}

             {/* AI Tutor Chat / Hints */}
             <div className="relative">
                <AITutor 
                  problem={currentProblem} 
                  language={userState.language} 
                  onScaffoldRequest={(level) => {
                     // Log that student needed help
                  }}
                />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActiveLesson;