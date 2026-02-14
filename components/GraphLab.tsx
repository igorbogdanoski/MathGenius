import React, { useState, useMemo } from 'react';
import { X, Beaker, Info, Sliders } from 'lucide-react';

interface Props {
  onClose: () => void;
  language: string;
}

const GraphLab: React.FC<Props> = ({ onClose, language }) => {
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);

  // SVG Coordinate calculation
  const points = useMemo(() => {
    const xRange = [-10, 10];
    const p1 = { x: -10, y: m * -10 + c };
    const p2 = { x: 10, y: m * 10 + c };
    
    // Scale to SVG 300x300 (Center 150,150, Scale 15px per unit)
    const scale = 15;
    const toSVG = (x: number, y: number) => ({
      x: 150 + x * scale,
      y: 150 - y * scale
    });

    return { start: toSVG(p1.x, p1.y), end: toSVG(p2.x, p2.y) };
  }, [m, c]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto">
        
        {/* Left Side: Controls */}
        <div className="p-8 md:w-1/3 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-xl">
                    <Beaker className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Graph Lab</h3>
            </div>

            <div className="space-y-8">
                {/* Slope Slider (m) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Slope (m)</label>
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-mono font-bold text-lg">{m.toFixed(1)}</span>
                    </div>
                    <input 
                        type="range" min="-5" max="5" step="0.1" value={m} 
                        onChange={(e) => setM(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-slate-400 italic">How steep is the line?</p>
                </div>

                {/* Intercept Slider (c) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Intercept (c)</label>
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-lg font-mono font-bold text-lg">{c.toFixed(1)}</span>
                    </div>
                    <input 
                        type="range" min="-10" max="10" step="0.5" value={c} 
                        onChange={(e) => setC(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-xs text-slate-400 italic">Where does it cross the Y-axis?</p>
                </div>
            </div>
          </div>

          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="flex gap-3 text-slate-600">
                <Info className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                    Equation: <span className="font-bold font-mono text-indigo-600 text-sm">y = {m === 1 ? '' : m === -1 ? '-' : m}{m !== 0 ? 'x' : ''} {c > 0 ? `+ ${c}` : c < 0 ? `- ${Math.abs(c)}` : ''}</span>
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Graph Visualization */}
        <div className="flex-1 bg-slate-50 p-8 relative flex items-center justify-center overflow-hidden">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-200">
                <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                    {/* Grid Lines */}
                    {Array.from({length: 21}).map((_, i) => (
                        <React.Fragment key={i}>
                            <line x1={i * 15} y1="0" x2={i * 15} y2="300" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1={i * 15} x2="300" y2={i * 15} stroke="#f1f5f9" strokeWidth="1" />
                        </React.Fragment>
                    ))}
                    
                    {/* Axes */}
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />

                    {/* Labels */}
                    <text x="285" y="145" fontSize="10" fill="#94a3b8" fontWeight="bold">x</text>
                    <text x="155" y="15" fontSize="10" fill="#94a3b8" fontWeight="bold">y</text>

                    {/* The Live Line */}
                    <line 
                        x1={points.start.x} y1={points.start.y} 
                        x2={points.end.x} y2={points.end.y} 
                        stroke="#4f46e5" strokeWidth="4" strokeLinecap="round"
                        className="transition-all duration-300 ease-out shadow-lg"
                    />

                    {/* Intercept Point */}
                    <circle cx="150" cy={150 - c * 15} r="5" fill="#c026d3" />
                </svg>
            </div>

            {/* Decoration */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default GraphLab;
