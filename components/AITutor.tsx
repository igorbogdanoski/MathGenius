import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Lightbulb, GraduationCap, Send, User } from 'lucide-react';
import { Problem, Language } from '../types';
import { UI_LABELS } from '../constants';
import MathRenderer from './MathRenderer';
import { chatWithTutor } from '../services/geminiService';

interface Props {
  problem: Problem;
  language: Language;
  onScaffoldRequest: (level: number) => void;
}

const AITutor: React.FC<Props> = ({ problem, language, onScaffoldRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState(0); // 0: None, 1: Hint, 2: Explanation, 3: Chat
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

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

  const handleChatMode = () => {
    setLevel(3);
    setIsOpen(true);
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'model',
        content: language === 'MK' ? 'Здраво! Имаш ли некое прашање за оваа задача?' : 'Hi! Do you have a question about this problem?'
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user', content: userMsg }];
    setChatHistory(newHistory);
    setIsTyping(true);

    const response = await chatWithTutor(userMsg, problem, newHistory, language);
    
    setChatHistory([...newHistory, { role: 'model', content: response }]);
    setIsTyping(false);
  };

  const labels = UI_LABELS[language];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-bold">{labels.tutorName}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 text-gray-800 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-indigo-100">
            {level === 1 && (
              <div className="fade-in bg-white p-3 rounded-lg border border-indigo-50 shadow-sm">
                <p className="font-bold text-indigo-600 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Hint:
                </p>
                <MathRenderer text={problem.ai_tutor_logic.hint[language]} />
              </div>
            )}
            {level === 2 && (
              <div className="fade-in bg-white p-3 rounded-lg border border-green-50 shadow-sm">
                <p className="font-bold text-green-600 mb-2">Explanation:</p>
                <MathRenderer text={problem.ai_tutor_logic.explanation[language]} />
              </div>
            )}
            {level === 3 && (
              <div className="space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}>
                      <MathRenderer text={msg.content} />
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t shrink-0">
            {level === 3 ? (
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={language === 'MK' ? 'Прашај нешто...' : 'Ask something...'}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {level === 1 && (
                   <button 
                     onClick={handleExplain}
                     className="text-xs text-indigo-600 font-bold hover:underline"
                   >
                     I still don't get it
                   </button>
                )}
                <button 
                  onClick={handleChatMode}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Ask specific question
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleChatMode}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 font-semibold pr-4"
        >
          <MessageCircle className="w-5 h-5" />
          {labels.tutorName}
        </button>
        <button
          onClick={handleHint}
          className="bg-white text-indigo-600 p-3 rounded-full shadow-lg border border-indigo-100 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 font-semibold pr-4"
        >
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {labels.hint}
        </button>
      </div>
    </div>
  );
};

export default AITutor;