import React from 'react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  const languages: Language[] = ['MK', 'SQ', 'TR', 'EN'];
  
  return (
    <div className="flex space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
            currentLang === lang
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;