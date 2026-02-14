import React, { useState } from 'react';
import { MessageCircle, Lightbulb, GraduationCap } from 'lucide-react';
import { Problem, Language } from '../types';
import { UI_LABELS } from '../constants';
import MathRenderer from './MathRenderer';

interface Props {
  problem: Problem;
  language: Language;
  onScaffoldRequest: (level: number) => void;
}

const AITutor: React.FC<Props> = ({ problem, language, onScaffoldRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState(0); // 0: None, 1: Hint, 2: Explanation

  const handleHint = () => {
    setLevel(1);
    setIsOpen(true);
    onScaffoldRequest(1);
  };

  const handleExplain = () => {
    setLevel(2);
    setIsOpen(true);
    onScaffoldRequest(2);
  };

  const labels = UI_LABELS[language];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden fade-in">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-bold">{labels.tutorName}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">✕</button>
          </div>
          
          <div className="p-4 bg-gray-50 text-gray-800 text-sm leading-relaxed">
            {level === 1 && (
              <div className="fade-in">
                <p className="font-semibold text-indigo-600 mb-1">Hint:</p>
                <MathRenderer text={problem.ai_tutor_logic.hint[language]} />
              </div>
            )}
            {level === 2 && (
              <div className="fade-in">
                <p className="font-semibold text-green-600 mb-1">Explanation:</p>
                <MathRenderer text={problem.ai_tutor_logic.explanation[language]} />
              </div>
            )}
          </div>

          <div className="p-2 bg-white border-t flex justify-end gap-2">
            {level === 1 && (
               <button 
                 onClick={handleExplain}
                 className="text-xs text-indigo-600 font-bold hover:underline"
               >
                 I still don't get it
               </button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleHint}
          className="bg-white text-indigo-600 p-3 rounded-full shadow-lg border border-indigo-100 hover:bg-indigo-50 transition-transform hover:scale-105 flex items-center gap-2 font-semibold pr-4"
        >
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {labels.hint}
        </button>
      </div>
    </div>
  );
};

export default AITutor;