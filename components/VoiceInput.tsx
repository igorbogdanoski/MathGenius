import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface Props {
  language: Language;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<Props> = ({ language, onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      
      // Map app language to BCP 47 language tag
      const langMap: Record<Language, string> = {
        'MK': 'mk-MK',
        'EN': 'en-US',
        'SQ': 'sq-AL', // Albanian is supported in modern Chrome/Android
        'TR': 'tr-TR'
      };
      
      recog.lang = langMap[language] || 'en-US';

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      
      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
           // Simple math cleanup
           // "iks" -> "x", "plus" -> "+", etc (Basic heuristic)
           let cleanText = transcript.toLowerCase();
           cleanText = cleanText.replace(/equals/g, '=');
           cleanText = cleanText.replace(/plus/g, '+');
           cleanText = cleanText.replace(/minus/g, '-');
           
           onTranscript(cleanText);
        }
      };

      recog.onerror = (event: any) => {
        console.error("Speech error", event.error);
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isSupported) return null; // Don't render if not supported

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50' 
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Speak Answer"
    >
      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
    </button>
  );
};

export default VoiceInput;