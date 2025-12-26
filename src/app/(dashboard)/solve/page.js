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
  "Look for common factors or patterns",
  "Try substituting values to verify your answer",
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
  const [currentStep, setCurrentStep] = useState(1);
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
            ? `Great! I see you've captured a math problem. Let me help you solve it step by step. 🎯\n\nFirst, let's understand what we're working with. Can you tell me what type of equation this looks like?`
            : `I see you've captured some text. Let me help you work through this problem. 📝\n\nWhat would you like to understand better?`,
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

    const responses = [
      "Excellent thinking! 🌟 You're on the right track. Now, let's move to the next step...",
      "That's a great approach! Let me guide you through what comes next...",
      "Perfect! You've identified the key concept. Let's apply it...",
      "Good observation! Now, can you think about how to simplify this further?",
    ];

    const aiMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'teacher',
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'teaching',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    setCurrentStep(prev => Math.min(prev + 1, 5));
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

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const renderMessage = (msg) => {
    const isTeacher = msg.role === 'teacher';

    return (
      <div
        key={msg.id}
        className={`flex gap-4 ${isTeacher ? '' : 'flex-row-reverse'} animate-fadeIn`}
      >
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg ${isTeacher
          ? 'bg-gradient-to-br from-violet-500 to-purple-600'
          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
          }`}>
          {isTeacher ? '🤖' : getInitials(currentUser.firstName, currentUser.lastName)}
        </div>

        {/* Message */}
        <div className={`max-w-[80%] ${isTeacher ? '' : 'text-right'}`}>
          {/* Name and time */}
          <div className={`flex items-center gap-2 mb-1 ${isTeacher ? '' : 'justify-end'}`}>
            <span className="text-sm font-medium">{isTeacher ? 'Math Tutor' : 'You'}</span>
            <span className="text-xs text-foreground-secondary">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className={`rounded-2xl px-5 py-4 shadow-sm ${isTeacher
            ? 'bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-tl-sm'
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-sm'
            }`}>
            {/* Type indicator */}
            {msg.type === 'hint' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium mb-3">
                <span>💡</span> Hint
              </div>
            )}
            {msg.type === 'success' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium mb-3">
                <span>🎉</span> Correct!
              </div>
            )}
            {msg.type === 'welcome' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium mb-3">
                <span>👋</span> Welcome
              </div>
            )}

            {/* Message content */}
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isTeacher ? 'text-foreground' : ''}`}>
              {renderMessageContent(msg.message)}
            </div>

            {/* LaTeX if present */}
            {msg.latex && (
              <div className={`mt-4 p-4 rounded-xl ${isTeacher ? 'bg-neutral-50 dark:bg-neutral-900' : 'bg-primary-600/50'}`}>
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
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
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
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl mb-6 shadow-xl animate-pulse">
            🤖
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading Your Session...</h3>
          <p className="text-foreground-secondary">
            Preparing your math problem
          </p>
          <div className="flex justify-center gap-1 mt-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl mb-6 shadow-xl">
            😕
          </div>
          <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
          <p className="text-foreground-secondary mb-8">
            {error}
          </p>
          <Link href="/capture">
            <Button size="lg" className="shadow-lg">
              📷 Capture New Problem
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No session state
  if (!sessionId || !session) {
    return (
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="text-center max-w-lg px-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-5xl mb-8 shadow-2xl">
            📸
          </div>
          <h3 className="text-2xl font-bold mb-3">Ready to Learn?</h3>
          <p className="text-foreground-secondary text-lg mb-8">
            Capture a math problem to start your personalized tutoring session with AI.
          </p>
          <Link href="/capture">
            <Button size="lg" className="shadow-xl px-8 py-4 text-lg">
              📷 Capture Math Problem
            </Button>
          </Link>
          <p className="text-sm text-foreground-secondary mt-6">
            Take a photo or upload an image of any math problem
          </p>
        </div>
      </div>
    );
  }

  const problemDisplay = getProblemDisplay();

  return (
    <div className="fixed inset-0 lg:ml-64 flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Problem Sidebar (Desktop) */}
      <div className="hidden lg:flex lg:flex-col w-96 border-r border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl">
                📐
              </div>
              <div>
                <h2 className="font-bold">Current Problem</h2>
                <p className="text-xs text-foreground-secondary">Step {currentStep} of 5</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Problem Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800">
              <p className="text-sm text-foreground-secondary mb-3">{problemDisplay.text}</p>
              {problemDisplay.latex && (
                <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                  <MathRenderer latex={problemDisplay.latex} display />
                </div>
              )}
              {/* Show all blocks if multiple */}
              {session.blocks && session.blocks.length > 1 && (
                <div className="mt-3 space-y-2">
                  {session.blocks.slice(1).map((block, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-neutral-800 rounded-xl">
                      {block.type === 'formula' && block.latex ? (
                        <MathRenderer latex={block.latex} display />
                      ) : (
                        <p className="text-sm">{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Hints */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <h3 className="font-semibold">Available Hints</h3>
              </div>
              <div className="space-y-2">
                {defaultHints.map((hint, i) => (
                  <button
                    key={i}
                    className={`w-full p-4 rounded-xl text-left text-sm transition-all duration-300 ${revealedHints.includes(i)
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800'
                      : 'bg-neutral-50 dark:bg-neutral-800 border-2 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600'
                      }`}
                    onClick={() => revealHint(i)}
                  >
                    {revealedHints.includes(i) ? (
                      <span className="text-foreground">{hint}</span>
                    ) : (
                      <span className="flex items-center gap-2 text-foreground-secondary">
                        <span className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        Click to reveal hint
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview (if available) */}
            {session.imageBase64 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📷</span>
                  <h3 className="font-semibold">Original Image</h3>
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-neutral-100 dark:border-neutral-700">
                  <img
                    src={`data:image/jpeg;base64,${session.imageBase64}`}
                    alt="Captured problem"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <Link href="/capture" className="block">
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
        <div className="flex-shrink-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                🤖
              </div>
              <div>
                <h1 className="font-bold text-lg">AI Math Tutor</h1>
                <p className="text-sm text-foreground-secondary">
                  Step-by-step problem solving
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                🤖
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Math Tutor</div>
                <div className="flex items-center gap-2 px-5 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-foreground-secondary ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length < 3 && (
          <div className="px-6 pb-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickAction("I think this is a quadratic equation")}
                className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                🔢 Identify equation type
              </button>
              <button
                onClick={() => handleQuickAction("Can you explain the first step?")}
                className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                📖 Explain first step
              </button>
              <button
                onClick={() => handleQuickAction("Show me a similar example")}
                className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                💡 Show similar example
              </button>
            </div>
          </div>
        )}

        {/* Input Area - Fixed */}
        <div className="flex-shrink-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer or ask a question..."
                rows={2}
                className="resize-none pr-24 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 rounded-xl shadow-lg"
              >
                Send →
              </Button>
              <Button
                variant="secondary"
                onClick={handleHint}
                disabled={isTyping}
                className="px-6 rounded-xl"
              >
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
      <div className="fixed inset-0 lg:ml-64 flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl mb-6 shadow-xl animate-pulse">
            🤖
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading...</h3>
        </div>
      </div>
    }>
      <SolvePageContent />
    </Suspense>
  );
}
