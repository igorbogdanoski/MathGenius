import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Eraser } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Props {
  onPlotPoints: (points: Point[]) => void;
  targetEquation?: string;
  readOnly?: boolean;
}

const AXIS_RANGE = 10; // -10 to 10
const CANVAS_SIZE = 400;

const InteractiveGraph: React.FC<Props> = ({ onPlotPoints, targetEquation, readOnly = false }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Clear points if target equation changes (new problem)
  useEffect(() => {
    setPoints([]);
  }, [targetEquation]);

  // Convert screen coordinates to graph coordinates
  const getGraphCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const xPixel = clientX - rect.left;
    const yPixel = clientY - rect.top;

    // Center is 200, 200
    // Scale is 400px / 20 units = 20px per unit
    const scale = CANVAS_SIZE / (AXIS_RANGE * 2);
    
    const xGraph = Math.round((xPixel - CANVAS_SIZE / 2) / scale);
    const yGraph = Math.round(-(yPixel - CANVAS_SIZE / 2) / scale);

    // Bound checks
    if (Math.abs(xGraph) > AXIS_RANGE || Math.abs(yGraph) > AXIS_RANGE) return null;

    return { x: xGraph, y: yGraph };
  };

  const handleInteraction = (x: number, y: number) => {
    if (readOnly) return;
    const coords = getGraphCoordinates(x, y);
    if (coords) {
      // Toggle point: remove if exists, add if not
      const exists = points.find(p => p.x === coords.x && p.y === coords.y);
      let newPoints = [];
      if (exists) {
        newPoints = points.filter(p => p !== exists);
      } else {
        newPoints = [...points, coords];
      }
      setPoints(newPoints);
      onPlotPoints(newPoints);
    }
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    handleInteraction(event.clientX, event.clientY);
  };

  // Support for Tablets / Mobile
  const handleTouch = (event: React.TouchEvent<SVGSVGElement>) => {
    // Prevent scrolling while drawing
    // event.preventDefault(); // Commented out to allow scroll if needed outside graph, careful here.
    if(event.touches.length > 0) {
      const touch = event.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    }
  };

  // Convert graph coordinates to SVG pixels
  const toPixels = (x: number, y: number) => {
    const scale = CANVAS_SIZE / (AXIS_RANGE * 2);
    return {
      cx: (x * scale) + (CANVAS_SIZE / 2),
      cy: -(y * scale) + (CANVAS_SIZE / 2)
    };
  };

  // Generate ticks
  const ticks = [];
  for (let i = -AXIS_RANGE; i <= AXIS_RANGE; i++) {
    if (i === 0) continue; // handle origin separately
    ticks.push(i);
  }

  // LOGIC TO DRAW THE LINE THROUGH POINTS
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const getExtendedLineCoords = () => {
    if (sortedPoints.length < 2) return null;

    // Use first and last point to calculate slope (m) and intercept (c)
    const p1 = sortedPoints[0];
    const p2 = sortedPoints[sortedPoints.length - 1];
    
    // Vertical line check
    if (p1.x === p2.x) {
      return {
        x1: p1.x, y1: -AXIS_RANGE,
        x2: p1.x, y2: AXIS_RANGE
      };
    }

    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const c = p1.y - m * p1.x;

    // Find intersections with box x=[-10, 10], y=[-10, 10]
    // Simply extend to edges of grid
    const xLeft = -AXIS_RANGE;
    const yLeft = m * xLeft + c;
    
    const xRight = AXIS_RANGE;
    const yRight = m * xRight + c;

    return {
        x1: xLeft, y1: yLeft,
        x2: xRight, y2: yRight
    };
  };

  const lineCoords = getExtendedLineCoords();

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[400px]">
      <div className="mb-2 text-xs text-gray-500 flex items-center gap-2">
        <MousePointer2 className="w-4 h-4" />
        <span>Click or Tap intersections. Plot 2 points.</span>
      </div>
      
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        role="application"
        aria-label="Interactive Graph. Tap to plot points."
        className={`w-full bg-white border-2 border-gray-300 rounded-lg shadow-inner transition-opacity touch-none ${
          !readOnly ? 'cursor-crosshair hover:border-indigo-300' : 'cursor-default opacity-90 bg-gray-50'
        }`}
        onClick={handleClick}
        onTouchStart={handleTouch}
      >
        {/* Grid Lines */}
        {ticks.map((i) => {
           const pos = (i + AXIS_RANGE) * (CANVAS_SIZE / (AXIS_RANGE * 2));
           return (
             <React.Fragment key={i}>
               <line x1={pos} y1={0} x2={pos} y2={CANVAS_SIZE} stroke="#f3f4f6" strokeWidth="1" />
               <line x1={0} y1={pos} x2={CANVAS_SIZE} y2={pos} stroke="#f3f4f6" strokeWidth="1" />
             </React.Fragment>
           );
        })}

        {/* Axes */}
        <line x1={CANVAS_SIZE / 2} y1={0} x2={CANVAS_SIZE / 2} y2={CANVAS_SIZE} stroke="#9ca3af" strokeWidth="2" />
        <line x1={0} y1={CANVAS_SIZE / 2} x2={CANVAS_SIZE} y2={CANVAS_SIZE / 2} stroke="#9ca3af" strokeWidth="2" />

        {/* Axis Labels */}
        {ticks.map((i) => {
          if (i % 2 !== 0) return null; // Only label even numbers
          const xPos = toPixels(i, 0).cx;
          const yPos = toPixels(0, i).cy;
          
          return (
            <React.Fragment key={`label-${i}`}>
               <text x={xPos} y={CANVAS_SIZE / 2 + 15} textAnchor="middle" fontSize="10" fill="#6b7280">{i}</text>
               <text x={CANVAS_SIZE / 2 - 10} y={yPos + 3} textAnchor="end" fontSize="10" fill="#6b7280">{i}</text>
            </React.Fragment>
          )
        })}
        <text x={CANVAS_SIZE/2 - 5} y={CANVAS_SIZE/2 + 15} fontSize="10" fill="#6b7280">0</text>

        {/* Extended Line Preview */}
        {lineCoords && (
          <line
            x1={toPixels(lineCoords.x1, lineCoords.y1).cx}
            y1={toPixels(lineCoords.x1, lineCoords.y1).cy}
            x2={toPixels(lineCoords.x2, lineCoords.y2).cx}
            y2={toPixels(lineCoords.x2, lineCoords.y2).cy}
            stroke={readOnly ? "#10b981" : "#4f46e5"}
            strokeWidth="3"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        )}

        {/* User Plotted Points */}
        {points.map((p, idx) => {
          const pixel = toPixels(p.x, p.y);
          return (
            <g key={`${p.x}-${p.y}`}>
               <circle
                cx={pixel.cx}
                cy={pixel.cy}
                r={6}
                fill={readOnly ? "#10b981" : "#4f46e5"}
                stroke="white"
                strokeWidth="2"
                className="transition-all"
              />
              <text x={pixel.cx + 8} y={pixel.cy - 8} fontSize="10" fill={readOnly ? "#059669" : "#4f46e5"} fontWeight="bold">
                ({p.x}, {p.y})
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="mt-2 flex gap-4 h-8">
        {!readOnly && (
          <button 
            onClick={() => { setPoints([]); onPlotPoints([]); }}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            <Eraser className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveGraph;