import React, { useState } from 'react';
import { BookOpen, LineChart, Brain, ArrowRight, Languages, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { WELCOME_CONTENT } from '../constants';

interface Props {
  onStart: (lang: Language, name: string) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('MK');
  const [name, setName] = useState('');

  const content = WELCOME_CONTENT[selectedLang];

  const handleStart = () => {
    if (!name.trim()) {
        alert(selectedLang === 'MK' ? 'Ве молиме внесете име' : 'Please enter your name');
        return;
    }
    onStart(selectedLang, name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Side: Language & Intro */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold tracking-wider uppercase text-xs">
              <Languages className="w-4 h-4" /> Select Language / Изберете Јазик
            </div>
            
            {/* Language Grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {(['MK', 'SQ', 'TR', 'EN'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`py-3 px-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedLang === lang 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105' 
                      : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {lang === 'MK' && '🇲🇰 MK'}
                  {lang === 'SQ' && '🇦🇱 SQ'}
                  {lang === 'TR' && '🇹🇷 TR'}
                  {lang === 'EN' && '🇬🇧 EN'}
                </button>
              ))}
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
              {content.title}
            </h1>
            
            <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    {selectedLang === 'MK' ? 'Твоето име:' : 'Your Name:'}
                </label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedLang === 'MK' ? 'Внеси име...' : 'Enter name...'}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-lg font-medium"
                />
            </div>

            <p className="text-lg text-slate-600 mb-8 font-light">
              {content.subtitle}
            </p>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-8">
               <p className="text-blue-800 text-sm leading-relaxed">
                 {content.whatIsThis}
               </p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            {content.startButton} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side: Tutorial / Features */}
        <div className="md:w-1/2 bg-slate-900 p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

           <h2 className="text-2xl font-bold mb-8 relative z-10">{content.howItWorks}</h2>

           <div className="space-y-8 relative z-10">
              <div className="flex gap-4">
                 <div className="bg-indigo-500/20 p-3 rounded-lg h-fit">
                    <BookOpen className="w-6 h-6 text-indigo-300" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-indigo-100">{content.step1}</h3>
                    <p className="text-sm text-slate-400 mt-1">{content.step1Desc}</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-purple-500/20 p-3 rounded-lg h-fit">
                    <CheckCircle2 className="w-6 h-6 text-purple-300" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-purple-100">{content.step2}</h3>
                    <p className="text-sm text-slate-400 mt-1">{content.step2Desc}</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-pink-500/20 p-3 rounded-lg h-fit">
                    <LineChart className="w-6 h-6 text-pink-300" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-pink-100">{content.step3}</h3>
                    <p className="text-sm text-slate-400 mt-1">{content.step3Desc}</p>
                 </div>
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm flex items-start gap-3">
                 <Brain className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                 <p className="text-xs text-slate-300">
                    <span className="text-yellow-400 font-bold">Pro Tip: </span>
                    Wait for the AI Tutor to analyze your mistakes. The tasks are shuffled every time for a unique experience!
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;