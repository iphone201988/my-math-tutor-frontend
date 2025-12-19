'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import MathRenderer from '@/components/chat/MathRenderer';
import { mockChatHistory, sampleProblems } from '@/data/sessions';
import { currentUser } from '@/data/users';
import { getInitials } from '@/lib/utils';

export default function SolvePage() {
  const [messages, setMessages] = useState(mockChatHistory);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentProblem = sampleProblems[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'student',
      message: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
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
    
    const hintMessage = {
      id: `msg-${Date.now()}`,
      role: 'teacher',
      message: "💡 **Hint:** Remember, when you have a quadratic in the form $x^2 + bx + c = 0$, try to find two numbers that multiply to give $c$ and add to give $b$.",
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
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
          isTeacher 
            ? 'bg-gradient-to-br from-primary-400 to-primary-600' 
            : 'bg-gradient-to-br from-secondary-400 to-secondary-600'
        }`}>
          {isTeacher ? '🤖' : getInitials(currentUser.firstName, currentUser.lastName)}
        </div>

        {/* Message */}
        <div className={`max-w-[75%] ${isTeacher ? '' : 'text-right'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isTeacher 
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

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Problem Sidebar (Desktop) */}
      <div className="hidden lg:block w-80 border-r border-[var(--card-border)] bg-background p-6 overflow-y-auto">
        <h2 className="font-semibold mb-4">Current Problem</h2>
        <Card className="mb-6">
          <CardContent>
            <p className="text-sm text-foreground-secondary mb-3">{currentProblem.text}</p>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <MathRenderer latex={currentProblem.latex} display />
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold mb-3">Available Hints</h3>
        <div className="space-y-2">
          {currentProblem.hints.map((hint, i) => (
            <div key={i} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-sm">
              <span className="text-foreground-secondary">Hint {i + 1}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/capture">
            <Button variant="secondary" className="w-full">
              📷 Scan New Problem
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background-secondary">
        {/* Header */}
        <div className="bg-background border-b border-[var(--card-border)] px-6 py-4">
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

        {/* Messages */}
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

        {/* Input Area */}
        <div className="bg-background border-t border-[var(--card-border)] p-4">
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
