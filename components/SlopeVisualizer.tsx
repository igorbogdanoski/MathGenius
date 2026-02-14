import React, { useState } from 'react';
import { Language } from '../types';

interface Props {
  language?: Language;
}

const SlopeVisualizer: React.FC<Props> = ({ language = 'EN' }) => {
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);

  const size = 300;
  const range = 10;
  const scale = size / (range * 2);

  // Labels
  const labels = {
    EN: { title: "Visualizer", grad: "Gradient (m)", int: "Intercept (c)", gradHint: "Controls the steepness.", intHint: "Controls where line crosses Y-axis." },
    MK: { title: "Визуелизатор", grad: "Коефициент на правец (m)", int: "Слободен член (c)", gradHint: "Ја контролира стрмнината.", intHint: "Каде линијата ја сече y-оската." },
    SQ: { title: "Vizualizues", grad: "Gradienti (m)", int: "Ndërprerja (c)", gradHint: "Kontrollon pjerrësinë.", intHint: "Kontrollon ku vija pret boshtin Y." },
    TR: { title: "Görselleştirici", grad: "Eğim (m)", int: "Kesişim (c)", gradHint: "Dikliği kontrol eder.", intHint: "Doğrunun Y eksenini kestiği yer." }
  };

  const t = labels[language] || labels['EN'];

  // Calculate line coordinates for SVG
  // y = mx + c
  // At x = -10: y1 = m(-10) + c
  // At x = 10:  y2 = m(10) + c
  
  const x1 = -10;
  const y1 = m * x1 + c;
  const x2 = 10;
  const y2 = m * x2 + c;

  // Convert to SVG coords
  const toSvg = (x: number, y: number) => ({
    x: (x + range) * scale,
    y: size - (y + range) * scale // Flip Y for SVG
  });

  const p1 = toSvg(x1, y1);
  const p2 = toSvg(x2, y2);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1 w-full space-y-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">{t.title}: <span className="text-indigo-600 font-mono">y = mx + c</span></h3>
          <p className="text-sm text-gray-500">Adjust the sliders to see how Gradient (m) and Intercept (c) change the line.</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-indigo-600">{t.grad}</label>
              <span className="text-sm font-mono bg-indigo-50 px-2 rounded">{m}</span>
            </div>
            <input 
              type="range" min="-10" max="10" step="0.5" 
              value={m} onChange={(e) => setM(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-gray-400 mt-1">{t.gradHint}</p>
          </div>

          <div>
             <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-pink-500">{t.int}</label>
              <span className="text-sm font-mono bg-pink-50 px-2 rounded">{c}</span>
            </div>
            <input 
              type="range" min="-10" max="10" step="1" 
              value={c} onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <p className="text-xs text-gray-400 mt-1">{t.intHint}</p>
          </div>
        </div>
      </div>

      <div className="relative border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-inner">
        <svg width={size} height={size} className="block">
          {/* Grid */}
          <defs>
            <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
              <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Axes */}
          <line x1={size/2} y1={0} x2={size/2} y2={size} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={0} y1={size/2} x2={size} y2={size/2} stroke="#cbd5e1" strokeWidth="2" />

          {/* The Function Line */}
          <line 
            x1={p1.x} y1={p1.y} 
            x2={p2.x} y2={p2.y} 
            stroke="#4f46e5" strokeWidth="3" 
          />
          
          {/* Intercept Point */}
          <circle cx={size/2} cy={toSvg(0, c).y} r="5" fill="#ec4899" />
          
          {/* Equation Label */}
          <text x="10" y="20" className="font-mono text-xs fill-gray-400">
             y = {m}x {c >= 0 ? '+' : ''}{c}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default SlopeVisualizer;