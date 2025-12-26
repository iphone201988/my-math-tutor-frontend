'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import MathRenderer from '@/components/chat/MathRenderer';
import { currentUser } from '@/data/users';
import { getInitials } from '@/lib/utils';

// Backend API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Dummy hints for now (will be replaced with AI-generated hints later)
const defaultHints = [
  "Identify what type of equation this is",
  "Look for common factors",
  "Try substituting values to verify",
];

function SolvePageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [revealedHints, setRevealedHints] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        console.log('📚 Fetching session:', sessionId);
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to fetch session');
        }

        console.log('✅ Session loaded:', data.data);
        setSession(data.data);

        // Create initial welcome message based on session data
        const blocks = data.data.blocks || [];
        const hasFormula = blocks.some(b => b.type === 'formula');

        const welcomeMessage = {
          id: 'welcome',
          role: 'teacher',
          type: 'welcome',
          message: hasFormula
            ? `I see you've captured a math problem! Let me help you solve it step by step. Looking at the equation, let's start by understanding what we need to find.`
            : `I see you've captured some text. Let me help you work through this problem. What would you like to understand better?`,
          timestamp: new Date().toISOString(),
        };

        setMessages([welcomeMessage]);

      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Reveal a hint
  const revealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'student',
      message: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call later)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'teacher',
      message: "That's a great approach! Let me guide you through the next step. Think about what happens when you factor the equation...",
      type: 'teaching',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleHint = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const blocks = session?.blocks || [];
    const firstFormula = blocks.find(b => b.type === 'formula');

    const hintMessage = {
      id: `msg-${Date.now()}`,
      role: 'teacher',
      message: firstFormula
        ? `💡 **Hint:** Looking at ${firstFormula.latex ? `$${firstFormula.latex}$` : 'the equation'}, try to identify the type of problem first. Is it a linear equation, quadratic, or something else?`
        : `💡 **Hint:** Start by breaking down the problem into smaller parts. What information do you have, and what are you trying to find?`,
      type: 'hint',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, hintMessage]);
    setIsTyping(false);
  };

  const renderMessage = (msg) => {
    const isTeacher = msg.role === 'teacher';

    return (
      <div
        key={msg.id}
        className={`flex gap-3 ${isTeacher ? '' : 'flex-row-reverse'}`}
      >
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isTeacher
          ? 'bg-gradient-to-br from-primary-400 to-primary-600'
          : 'bg-gradient-to-br from-secondary-400 to-secondary-600'
          }`}>
          {isTeacher ? '🤖' : getInitials(currentUser.firstName, currentUser.lastName)}
        </div>

        {/* Message */}
        <div className={`max-w-[75%] ${isTeacher ? '' : 'text-right'}`}>
          <div className={`rounded-2xl px-4 py-3 ${isTeacher
            ? 'bg-neutral-100 dark:bg-neutral-800 rounded-tl-none'
            : 'bg-primary-500 text-white rounded-tr-none'
            }`}>
            {/* Type indicator */}
            {msg.type === 'hint' && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium mb-2">
                💡 Hint
              </span>
            )}
            {msg.type === 'success' && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium mb-2">
                🎉 Correct!
              </span>
            )}
            {msg.type === 'welcome' && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium mb-2">
                👋 Welcome
              </span>
            )}

            {/* Message content */}
            <div className={`text-sm whitespace-pre-wrap ${isTeacher ? 'text-foreground' : ''}`}>
              {renderMessageContent(msg.message)}
            </div>

            {/* LaTeX if present */}
            {msg.latex && (
              <div className={`mt-3 p-3 rounded-lg ${isTeacher ? 'bg-white dark:bg-neutral-900' : 'bg-primary-600'}`}>
                <MathRenderer latex={msg.latex} display />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (text) => {
    // Simple markdown-like rendering
    const parts = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <MathRenderer key={i} latex={part.slice(1, -1)} />;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Get problem data for display
  const getProblemDisplay = () => {
    if (!session || !session.blocks || session.blocks.length === 0) {
      return {
        text: 'Solve the captured math problem',
        latex: null,
      };
    }
    const firstFormula = session.blocks.find(b => b.type === 'formula');
    if (firstFormula && firstFormula.latex) {
      return {
        text: 'Solve the following equation:',
        latex: firstFormula.latex,
      };
    }
    const firstText = session.blocks.find(b => b.type === 'text');
    return {
      text: firstText?.content || 'Solve the captured math problem',
      latex: null,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl mb-4">
            <span className="animate-spin">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Loading Session...</h3>
          <p className="text-foreground-secondary text-sm">
            Fetching your math problem
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl mb-4">
            ❌
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Session</h3>
          <p className="text-foreground-secondary text-sm mb-6">
            {error}
          </p>
          <Link href="/capture">
            <Button>Capture New Problem</Button>
          </Link>
        </div>
      </div>
    );
  }

  // No session state
  if (!sessionId || !session) {
    return (
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-3xl mb-4">
            📷
          </div>
          <h3 className="text-lg font-semibold mb-2">No Problem Selected</h3>
          <p className="text-foreground-secondary text-sm mb-6">
            Capture a math problem first to start solving it with the AI tutor.
          </p>
          <Link href="/capture">
            <Button>Capture Math Problem</Button>
          </Link>
        </div>
      </div>
    );
  }

  const problemDisplay = getProblemDisplay();

  return (
    <div className="fixed inset-0 lg:ml-64 flex flex-col lg:flex-row bg-background-secondary">
      {/* Problem Sidebar (Desktop) */}
      <div className="hidden lg:flex lg:flex-col w-80 border-r border-[var(--card-border)] bg-background">
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="font-semibold mb-4">Current Problem</h2>

          {/* Problem Card */}
          <Card className="mb-6">
            <CardContent>
              <p className="text-sm text-foreground-secondary mb-3">{problemDisplay.text}</p>
              {problemDisplay.latex && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <MathRenderer latex={problemDisplay.latex} display />
                </div>
              )}
              {/* Show all blocks if multiple */}
              {session.blocks && session.blocks.length > 1 && (
                <div className="mt-4 space-y-2">
                  {session.blocks.slice(1).map((block, i) => (
                    <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      {block.type === 'formula' && block.latex ? (
                        <MathRenderer latex={block.latex} display />
                      ) : (
                        <p className="text-sm">{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Hints */}
          <h3 className="font-semibold mb-3">Available Hints</h3>
          <div className="space-y-2 mb-6">
            {defaultHints.map((hint, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                onClick={() => revealHint(i)}
              >
                {revealedHints.includes(i) ? (
                  <span className="text-foreground">{hint}</span>
                ) : (
                  <span className="text-foreground-secondary">Hint {i + 1} - Click to reveal</span>
                )}
              </div>
            ))}
          </div>

          {/* Image Preview (if available) */}
          {session.imageBase64 && (
            <Card className="mb-6">
              <CardContent>
                <p className="text-sm text-foreground-secondary mb-2">📷 Captured Image</p>
                <img
                  src={`data:image/jpeg;base64,${session.imageBase64}`}
                  alt="Captured problem"
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          <div className="mt-6">
            <Link href="/capture">
              <Button variant="secondary" className="w-full">
                📷 Scan New Problem
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-background border-b border-[var(--card-border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold">AI Math Tutor 🤖</h1>
              <p className="text-sm text-foreground-secondary">
                I&apos;ll guide you through problems step by step
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-foreground-secondary">Online</span>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                🤖
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed */}
        <div className="flex-shrink-0 bg-background border-t border-[var(--card-border)] p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer or question..."
                rows={2}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
                Send
              </Button>
              <Button variant="secondary" onClick={handleHint} disabled={isTyping}>
                💡 Hint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SolvePage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl mb-4">
            <span className="animate-spin">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Loading...</h3>
        </div>
      </div>
    }>
      <SolvePageContent />
    </Suspense>
  );
}
