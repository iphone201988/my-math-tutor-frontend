'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

// Try to render LaTeX with progressively more aggressive cleanup
function tryRenderLatex(latex, container, displayMode) {
  if (!latex) return false;

  const options = {
    throwOnError: true, // We want to catch errors
    trust: true,
    strict: false,
    displayMode: displayMode,
  };

  // Stage 1: Try original latex
  try {
    katex.render(latex, container, options);
    return true;
  } catch (e) {
    // Continue to next stage
  }

  // Stage 2: Replace \mathrm with \text and fix tildes
  try {
    const cleaned = latex
      .replace(/\\mathrm\{/g, '\\text{')
      .replace(/~/g, '\\,');
    katex.render(cleaned, container, options);
    return true;
  } catch (e) {
    // Continue to next stage
  }

  // Stage 3: Strip all \mathrm{...} content and keep only math
  try {
    const stripped = latex
      .replace(/\\mathrm\s*\{[^}]*\}/g, '') // Remove \mathrm{...} completely
      .replace(/\\text\s*\{[^}]*\}/g, '') // Remove \text{...} completely
      .replace(/\\begin\{array\}\{[^}]*\}/g, '') // Remove array start
      .replace(/\\end\{array\}/g, '') // Remove array end
      .replace(/\\\\/g, ' ') // Remove line breaks
      .replace(/\{\{+/g, '{') // Fix nested braces
      .replace(/\}\}+/g, '}')
      .replace(/~/g, ' ')
      .trim();

    if (stripped) {
      katex.render(stripped, container, { ...options, throwOnError: false });
      return true;
    }
  } catch (e) {
    // Continue to fallback
  }

  // Stage 4: Last resort - show raw latex in styled pre
  container.innerHTML = `<div style="font-family: monospace; font-size: 14px; padding: 8px; background: #f5f5f5; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">${latex}</div>`;
  return false;
}

export default function MathRenderer({ latex, display = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      tryRenderLatex(latex, containerRef.current, display);
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
          const latex = part.slice(2, -2);
          const div = document.createElement('div');
          div.className = 'py-2 overflow-x-auto';
          tryRenderLatex(latex, div, true);
          containerRef.current.appendChild(div);
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          const span = document.createElement('span');
          tryRenderLatex(latex, span, false);
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
