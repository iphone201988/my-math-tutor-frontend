'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathRenderer({ latex, display = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: display,
          trust: true,
          strict: false
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.textContent = latex;
      }
    }
  }, [latex, display]);

  if (display) {
    return (
      <div className={`katex-display ${className}`}>
        <span ref={containerRef} />
      </div>
    );
  }

  return <span ref={containerRef} className={className} />;
}

// Render markdown-like text with inline LaTeX
export function MathText({ text, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && text) {
      // Replace $...$ with rendered KaTeX
      const parts = text.split(/(\$[^$]+\$)/g);
      containerRef.current.innerHTML = '';
      
      parts.forEach(part => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          const span = document.createElement('span');
          try {
            katex.render(latex, span, {
              throwOnError: false,
              displayMode: false
            });
          } catch {
            span.textContent = latex;
          }
          containerRef.current.appendChild(span);
        } else {
          const textNode = document.createTextNode(part);
          containerRef.current.appendChild(textNode);
        }
      });
    }
  }, [text]);

  return <span ref={containerRef} className={className} />;
}
