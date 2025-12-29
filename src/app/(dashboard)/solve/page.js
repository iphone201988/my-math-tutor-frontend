'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import MathRenderer, { MathText } from '@/components/chat/MathRenderer';
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
  const [agentSessionId, setAgentSessionId] = useState(null); // Agent service session ID
  const [gradeLevel, setGradeLevel] = useState('primary'); // Default grade level
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
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

        // Extract grade level from user profile if available (could be stored in session or user data)
        // For now, default to 'primary', but could be enhanced to get from user profile
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user.gradeLevel) {
              setGradeLevel(user.gradeLevel);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }

        // Get current problem LaTeX
        const currentProblemLatex = (() => {
          const blocks = data.data.blocks || [];
          const formulaBlock = blocks.find(b => b.type === 'formula' && b.latex);
          if (formulaBlock && formulaBlock.latex) {
            return formulaBlock.latex;
          }
          return data.data.layoutMarkdown || '';
        })();

        // Send initial welcome message to agent to establish session
        if (currentProblemLatex) {
          try {
            const agentResponse = await fetch(`${API_BASE_URL}/agent/chat`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                sessionId: null, // New session
                studentMessage: 'Hello, I need help with this problem',
                gradeLevel: gradeLevel,
                currentTopic: data.data.topic || 'algebra',
                currentProblem: currentProblemLatex,
                studentAnswer: null,
              }),
            });

            if (agentResponse.ok) {
              const agentData = await agentResponse.json();
              if (agentData.success) {
                const { jobId } = agentData.data;
                
                // Update agent session ID
                if (agentData.data.sessionId) {
                  setAgentSessionId(agentData.data.sessionId);
                }

                // Poll for welcome message
                const result = await pollAgentJobStatus(jobId, 30, 500);
                
                if (result.sessionId) {
                  setAgentSessionId(result.sessionId);
                }

                const welcomeMessage = {
                  id: 'welcome',
                  role: 'teacher',
                  type: result.messageType || 'welcome',
                  message: result.agentMessage,
                  latexBlocks: result.latexBlocks || [],
                  timestamp: new Date().toISOString(),
                };

                setMessages([welcomeMessage]);
                return; // Exit early if agent message received
              }
            }
          } catch (error) {
            console.error('Error getting welcome message from agent:', error);
            // Fall through to default welcome message
          }
        }

        // Fallback welcome message if agent call fails
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

  // Get current problem LaTeX from session
  const getCurrentProblemLatex = () => {
    if (!session || !session.blocks) return '';
    
    // Try to find LaTeX from formula blocks
    const formulaBlock = session.blocks.find(b => b.type === 'formula' && b.latex);
    if (formulaBlock && formulaBlock.latex) {
      return formulaBlock.latex;
    }
    
    // Fallback to layoutMarkdown if available
    if (session.layoutMarkdown) {
      // Extract LaTeX from markdown (simple extraction)
      const latexMatch = session.layoutMarkdown.match(/\$\$([^$]+)\$\$/);
      if (latexMatch) return latexMatch[1];
    }
    
    return session.layoutMarkdown || '';
  };

  // Poll for agent job status
  const pollAgentJobStatus = async (jobId, maxAttempts = 60, interval = 500) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/agent/chat/${jobId}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to get job status');
        }

        const status = data.data;

        // Update progress if available
        if (status.progress !== undefined) {
          // Could show progress indicator here
        }

        // If completed, return result
        if (status.status === 'completed' && status.result) {
          return status.result;
        }

        // If failed, throw error
        if (status.status === 'failed') {
          throw new Error(status.error || 'Agent job failed');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        // On last attempt, throw error
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        // Otherwise, wait and retry
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('Timeout waiting for agent response');
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !session) return;

    const studentMessage = inputValue.trim();
    const currentProblemLatex = getCurrentProblemLatex();

    if (!currentProblemLatex) {
      alert('No problem data available. Please capture a problem first.');
      return;
    }

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'student',
      message: studentMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send chat request to agent API
      const response = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sessionId: agentSessionId,
          studentMessage: studentMessage,
          gradeLevel: gradeLevel,
          currentTopic: session.topic || 'algebra',
          currentProblem: currentProblemLatex,
          studentAnswer: null, // Could extract from message if it looks like an answer
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to send message to agent');
      }

      const { jobId, status: jobStatus } = data.data;
      
      // Update agent session ID if provided
      if (data.data.sessionId && !agentSessionId) {
        setAgentSessionId(data.data.sessionId);
      }

      console.log('🤖 Agent job queued:', jobId);

      // Poll for job completion
      const result = await pollAgentJobStatus(jobId);

      console.log('✅ Agent response received:', result);

      // Update agent session ID from result
      if (result.sessionId && !agentSessionId) {
        setAgentSessionId(result.sessionId);
      }

      // Add agent response message
      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'teacher',
        message: result.agentMessage,
        type: result.messageType || 'teaching',
        latex: result.latexBlocks && result.latexBlocks.length > 0 ? result.latexBlocks[0] : null,
        latexBlocks: result.latexBlocks || [],
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update step based on message type
      if (result.messageType === 'positive_feedback') {
        setCurrentStep(prev => Math.min(prev + 1, 5));
      }

    } catch (error) {
      console.error('Error sending message to agent:', error);
      
      // Show error message to user
      const errorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'teacher',
        message: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        type: 'error',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHint = async () => {
    if (!session) return;

    setIsTyping(true);

    const currentProblemLatex = getCurrentProblemLatex();

    if (!currentProblemLatex) {
      alert('No problem data available. Please capture a problem first.');
      setIsTyping(false);
      return;
    }

    try {
        // Send hint request to agent API
        const response = await fetch(`${API_BASE_URL}/agent/chat`, {
          method: 'POST',
          headers: getAuthHeaders(),
        body: JSON.stringify({
          sessionId: agentSessionId,
          studentMessage: 'I need a hint',
          gradeLevel: gradeLevel,
          currentTopic: session.topic || 'algebra',
          currentProblem: currentProblemLatex,
          studentAnswer: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to get hint from agent');
      }

      const { jobId } = data.data;
      
      // Update agent session ID if provided
      if (data.data.sessionId && !agentSessionId) {
        setAgentSessionId(data.data.sessionId);
      }

      // Poll for job completion
      const result = await pollAgentJobStatus(jobId);

      // Update agent session ID from result
      if (result.sessionId && !agentSessionId) {
        setAgentSessionId(result.sessionId);
      }

      // Add hint message
      const hintMessage = {
        id: `msg-${Date.now()}`,
        role: 'teacher',
        message: result.agentMessage,
        type: 'hint',
        latex: result.latexBlocks && result.latexBlocks.length > 0 ? result.latexBlocks[0] : null,
        latexBlocks: result.latexBlocks || [],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, hintMessage]);

    } catch (error) {
      console.error('Error getting hint from agent:', error);
      
      // Fallback hint message
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
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const renderMessage = (msg) => {
    const isTeacher = msg.role === 'teacher';

    return (
      <div
        key={msg.id}
        className={`flex gap-4 ${isTeacher ? '' : 'flex-row-reverse'} animate-fade-in`}
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
            <span className="text-sm font-medium text-foreground">{isTeacher ? 'Math Tutor' : 'You'}</span>
            <span className="text-xs text-foreground-secondary">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div
            className={`rounded-2xl px-5 py-4 ${isTeacher ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
            style={{
              background: isTeacher ? 'var(--card-bg)' : 'var(--gradient-primary)',
              border: isTeacher ? '1px solid var(--card-border)' : 'none',
              color: isTeacher ? 'var(--foreground)' : 'white',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Type indicator */}
            {msg.type === 'hint' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 badge-warning">
                <span>💡</span> Hint
              </div>
            )}
            {msg.type === 'success' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 badge-success">
                <span>🎉</span> Correct!
              </div>
            )}
            {msg.type === 'welcome' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 badge-primary">
                <span>👋</span> Welcome
              </div>
            )}

            {/* Message content */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderMessageContent(msg.message)}
            </div>

            {/* LaTeX blocks if present */}
            {msg.latexBlocks && msg.latexBlocks.length > 0 && (
              <div className="mt-4 space-y-3">
                {msg.latexBlocks.map((latex, idx) => (
                  <div key={idx} className="p-4 rounded-xl" style={{ background: 'var(--background-secondary)' }}>
                    <MathRenderer latex={latex} display />
                  </div>
                ))}
              </div>
            )}
            {/* Fallback to single latex if no blocks */}
            {!msg.latexBlocks && msg.latex && (
              <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--background-secondary)' }}>
                <MathRenderer latex={msg.latex} display />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (text) => {
    if (!text) return '';
    
    // Use MathText component which handles LaTeX properly
    // It splits by $$...$$ (display) and $...$ (inline) correctly
    return <MathText text={text} className="inline" />;
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
      <div
        className="fixed inset-0 lg:ml-64 flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl mb-6 shadow-xl animate-pulse">
            🤖
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Loading Your Session...</h3>
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
      <div
        className="fixed inset-0 lg:ml-64 flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl mb-6 shadow-xl">
            😕
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Oops! Something went wrong</h3>
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
      <div
        className="fixed inset-0 lg:ml-64 flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center max-w-lg px-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-5xl mb-8 shadow-2xl">
            📸
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground">Ready to Learn?</h3>
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
    <div
      className="fixed inset-0 lg:ml-64 flex flex-col lg:flex-row"
      style={{ background: 'var(--background)' }}
    >
      {/* Problem Sidebar (Desktop) */}
      <div
        className="hidden lg:flex lg:flex-col w-96"
        style={{
          background: 'var(--card-bg)',
          borderRight: '1px solid var(--card-border)',
        }}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="p-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                📐
              </div>
              <div>
                <h2 className="font-bold text-foreground">Current Problem</h2>
                <p className="text-xs text-foreground-secondary">Step {currentStep} of 5</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Problem Card */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <p className="text-sm text-foreground-secondary mb-3">{problemDisplay.text}</p>
              {problemDisplay.latex && (
                <div className="p-4 rounded-xl card">
                  <MathRenderer latex={problemDisplay.latex} display />
                </div>
              )}
              {/* Show all blocks if multiple */}
              {session.blocks && session.blocks.length > 1 && (
                <div className="mt-3 space-y-2">
                  {session.blocks.slice(1).map((block, i) => (
                    <div key={i} className="p-3 rounded-xl card">
                      {block.type === 'formula' && block.latex ? (
                        <MathRenderer latex={block.latex} display />
                      ) : (
                        <p className="text-sm text-foreground">{block.content}</p>
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
                <h3 className="font-semibold text-foreground">Available Hints</h3>
              </div>
              <div className="space-y-2">
                {defaultHints.map((hint, i) => (
                  <button
                    key={i}
                    className={`w-full p-4 rounded-xl text-left text-sm transition-all duration-300 ${revealedHints.includes(i)
                      ? 'badge-warning'
                      : ''
                      }`}
                    style={{
                      background: revealedHints.includes(i) ? 'rgba(234, 179, 8, 0.15)' : 'var(--background-secondary)',
                      border: revealedHints.includes(i) ? '2px solid rgba(234, 179, 8, 0.4)' : '2px solid transparent',
                      color: 'var(--foreground)',
                    }}
                    onClick={() => revealHint(i)}
                  >
                    {revealedHints.includes(i) ? (
                      <span>{hint}</span>
                    ) : (
                      <span className="flex items-center gap-2 text-foreground-secondary">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{ background: 'var(--card-border)' }}
                        >
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
                  <h3 className="font-semibold text-foreground">Original Image</h3>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: '2px solid var(--card-border)' }}>
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
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ background: 'var(--background-secondary)' }}
      >
        {/* Header - Fixed */}
        <div
          className="flex-shrink-0 px-6 py-4"
          style={{
            background: 'var(--card-bg)',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                🤖
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">AI Math Tutor</h1>
                <p className="text-sm text-foreground-secondary">
                  Step-by-step problem solving
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full badge-success">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                🤖
              </div>
              <div>
                <div className="text-sm font-medium mb-1 text-foreground">Math Tutor</div>
                <div
                  className="flex items-center gap-2 px-5 py-4 rounded-2xl rounded-tl-sm"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
              {[
                { icon: '🔢', text: 'Identify equation type', action: "I think this is a quadratic equation" },
                { icon: '📖', text: 'Explain first step', action: "Can you explain the first step?" },
                { icon: '💡', text: 'Show similar example', action: "Show me a similar example" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(item.action)}
                  className="px-4 py-2 rounded-full text-sm transition-all hover-lift"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--foreground)',
                  }}
                >
                  {item.icon} {item.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area - Fixed */}
        <div
          className="flex-shrink-0 p-4"
          style={{
            background: 'var(--card-bg)',
            borderTop: '1px solid var(--card-border)',
          }}
        >
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer or ask a question..."
                rows={2}
                className="resize-none rounded-2xl input"
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
      <div
        className="fixed inset-0 lg:ml-64 flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl mb-6 shadow-xl animate-pulse">
            🤖
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Loading...</h3>
        </div>
      </div>
    }>
      <SolvePageContent />
    </Suspense>
  );
}
