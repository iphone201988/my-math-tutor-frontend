'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

// Common KaTeX options for consistent rendering
const katexOptions = {
  throwOnError: false,
  trust: true,
  strict: false,
  fleqn: true, // Left-align equations
  macros: {
    "\\mathrm": "\\text", // fallback for \mathrm
  },
};

export default function MathRenderer({ latex, display = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        // Clean up the latex string before rendering
        let cleanLatex = latex
          .replace(/\\\\(?!\s)/g, '\\\\ ') // Add space after \\ for line breaks
          .trim();

        katex.render(cleanLatex, containerRef.current, {
          ...katexOptions,
          displayMode: display,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        // Show the raw latex on error
        containerRef.current.innerHTML = `<pre style="white-space: pre-wrap; font-size: 12px; color: #666;">${latex}</pre>`;
      }
    }
  }, [latex, display]);

  if (display) {
    return (
      <div className={`katex-display overflow-x-auto ${className}`}>
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
      // Split by $$...$$ or $...$
      const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g);
      containerRef.current.innerHTML = '';

      parts.forEach(part => {
        if (!part) return;

        if (part.startsWith('$$') && part.endsWith('$$')) {
          let latex = part.slice(2, -2).replace(/\\\\(?!\s)/g, '\\\\ ').trim();
          const div = document.createElement('div');
          div.className = 'py-2 overflow-x-auto';
          try {
            katex.render(latex, div, {
              ...katexOptions,
              displayMode: true
            });
          } catch {
            div.innerHTML = `<pre style="white-space: pre-wrap; font-size: 12px;">${part}</pre>`;
          }
          containerRef.current.appendChild(div);
        } else if (part.startsWith('$') && part.endsWith('$')) {
          let latex = part.slice(1, -1).replace(/\\\\(?!\s)/g, '\\\\ ').trim();
          const span = document.createElement('span');
          try {
            katex.render(latex, span, {
              ...katexOptions,
              displayMode: false
            });
          } catch {
            span.textContent = part;
          }
          containerRef.current.appendChild(span);
        } else {
          const span = document.createElement('span');
          span.textContent = part;
          containerRef.current.appendChild(span);
        }
      });
    }
  }, [text]);

  return <span ref={containerRef} className={className} />;
}
