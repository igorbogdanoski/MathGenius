import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  inline?: boolean;
}

declare global {
  interface Window {
    katex: any;
  }
}

const MathRenderer: React.FC<Props> = ({ text, className = "", inline = true }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);

  // Effect to check and wait for KaTeX loading
  useEffect(() => {
    if (window.katex) {
      setIsKatexLoaded(true);
    } else {
      // Poll every 100ms for KaTeX if not ready immediately
      const interval = setInterval(() => {
        if (window.katex) {
          setIsKatexLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If KaTeX isn't loaded yet, show text as fallback so it's not invisible
    // But if text looks like math ($...$), we might want to wait or show raw.
    if (!isKatexLoaded) {
      container.textContent = text;
      return;
    }

    // Split by '$' delimiters.
    // Example: "Solve $y=2x$" -> ["Solve ", "y=2x", ""]
    const parts = text.split('$');
    
    container.innerHTML = '';

    parts.forEach((part, index) => {
      // Even index = Plain Text, Odd index = Math
      if (index % 2 === 0) {
        if (part) {
          container.appendChild(document.createTextNode(part));
        }
      } else {
        // Math part
        const span = document.createElement('span');
        try {
          window.katex.render(part, span, {
            throwOnError: false,
            displayMode: !inline,
          });
        } catch (e) {
          console.warn("KaTeX render error:", e);
          span.textContent = part; // Fallback to raw text if render fails
        }
        container.appendChild(span);
      }
    });

  }, [text, inline, isKatexLoaded]);

  return <span ref={containerRef} className={className} />;
};

export default MathRenderer;