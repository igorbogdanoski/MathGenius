import React, { useState, useEffect } from 'react';
import { Image, Loader2, RefreshCw } from 'lucide-react';
import { generateSVG } from '../services/geminiService';

interface Props {
  description: string;
}

const AIIllustration: React.FC<Props> = ({ description }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchIllustration = async () => {
      if (!description) return;
      
      setLoading(true);
      setError(false);
      setSvgContent(null);

      // Check if we have an API key (mock check)
      if (!process.env.VITE_GEMINI_API_KEY) {
         // Mock delay for demo purposes if no key
         setTimeout(() => {
             if(mounted) {
                 setLoading(false);
                 setError(true); 
             }
         }, 1000);
         return;
      }

      try {
        const svg = await generateSVG(description);
        if (mounted) {
            if (svg && svg.includes('<svg')) {
                setSvgContent(svg);
            } else {
                setError(true);
            }
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchIllustration();

    return () => { mounted = false; };
  }, [description]);

  if (!description) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-indigo-50/50 rounded-xl border-2 border-dashed border-indigo-100 min-h-[200px]">
      {loading ? (
        <div className="flex flex-col items-center text-indigo-400 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-medium">Generating illustration...</span>
        </div>
      ) : svgContent ? (
        <div 
            className="w-48 h-48 transition-all duration-500 ease-out transform hover:scale-105"
            dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      ) : error ? (
        <div className="flex flex-col items-center text-gray-400">
           <div className="bg-gray-100 p-3 rounded-full mb-2">
             <Image className="w-6 h-6" />
           </div>
           <span className="text-xs text-center px-4">
             {process.env.VITE_GEMINI_API_KEY ? "Could not generate image." : "Connect API Key to see AI illustrations"}
           </span>
           <p className="text-[10px] mt-1 text-gray-400 italic">"{description}"</p>
        </div>
      ) : null}
      
      {!loading && svgContent && (
        <div className="mt-2 text-[10px] text-indigo-300 flex items-center gap-1 uppercase tracking-widest font-bold">
           <RefreshCw className="w-3 h-3" /> AI Generated
        </div>
      )}
    </div>
  );
};

export default AIIllustration;