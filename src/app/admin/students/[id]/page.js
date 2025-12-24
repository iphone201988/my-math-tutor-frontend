'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { students, topics } from '@/data/admin-data';
import { cn } from '@/lib/utils';

export default function StudentDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Find student
  const student = students.find(s => s.id === params.id) || students[0];

  // Get enrolled topic details
  const enrolledTopicDetails = topics.filter(t => student.enrolledTopics.includes(t.id));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes} minutes`;
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/students"
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{student.firstName} {student.lastName}</h1>
            <p className="text-foreground-secondary">{student.email}</p>
          </div>
          <span className={cn(
            'text-xs font-medium px-3 py-1 rounded-full',
            student.status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-200 dark:bg-neutral-700 text-foreground-secondary'
          )}>
            {student.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <span>📧</span>
            Send Message
          </button>
          <button className="btn btn-secondary">
            <span>🔄</span>
            Reset Quiz
          </button>
          <button className="btn btn-primary">
            <span>📚</span>
            Enroll in Topic
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-primary-500">Lvl {student.level}</p>
          <p className="text-xs text-foreground-secondary">Current Level</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold">{student.xpPoints}</p>
          <p className="text-xs text-foreground-secondary">XP Points</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-success">{student.avgQuizScore}%</p>
          <p className="text-xs text-foreground-secondary">Avg Quiz Score</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold">{student.enrolledTopics.length}</p>
          <p className="text-xs text-foreground-secondary">Topics Enrolled</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold">{formatTime(student.totalTimeSpent)}</p>
          <p className="text-xs text-foreground-secondary">Time Spent</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card p-1 inline-flex gap-1">
        {['overview', 'topics', 'quizzes', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              activeTab === tab
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-foreground-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Learning Progress</h3>
              <div className="space-y-4">
                {enrolledTopicDetails.map((topic) => {
                  const isCompleted = student.completedTopics.includes(topic.id);
                  const progress = isCompleted ? 100 : Math.floor(Math.random() * 80) + 10;
                  return (
                    <div key={topic.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <span className="text-lg">📚</span>
                          </div>
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <p className="text-xs text-foreground-secondary">{topic.lessonsCount} lessons · {topic.exercisesCount} exercises</p>
                          </div>
                        </div>
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full',
                          isCompleted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}>
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full',
                              isCompleted ? 'bg-success' : 'bg-primary-500'
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Enrolled Topics</h3>
                <button className="btn btn-primary btn-sm">
                  <span>➕</span>
                  Enroll
                </button>
              </div>
              <div className="space-y-3">
                {enrolledTopicDetails.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <p className="font-medium">{topic.title}</p>
                        <p className="text-xs text-foreground-secondary">{topic.gradeBand} · {topic.difficulty}</p>
                      </div>
                    </div>
                    <button className="text-error text-sm hover:underline">Unenroll</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Quiz History</h3>
              <div className="space-y-3">
                {[
                  { topic: 'Algebra Basics', score: 85, date: '2025-12-20', passed: true },
                  { topic: 'Fractions & Decimals', score: 92, date: '2025-12-15', passed: true },
                  { topic: 'Quadratic Equations', score: 68, date: '2025-12-10', passed: false },
                ].map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                    <div>
                      <p className="font-medium">{quiz.topic}</p>
                      <p className="text-xs text-foreground-secondary">{quiz.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-lg font-bold',
                        quiz.passed ? 'text-success' : 'text-error'
                      )}>
                        {quiz.score}%
                      </span>
                      <span className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        quiz.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      )}>
                        {quiz.passed ? 'Passed' : 'Failed'}
                      </span>
                      <button className="text-primary-500 text-sm hover:underline">Reset</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Completed lesson', detail: 'Variables and Constants', time: '2 hours ago', icon: '✅' },
                  { action: 'Started quiz', detail: 'Algebra Basics', time: '3 hours ago', icon: '📝' },
                  { action: 'Earned XP', detail: '+50 XP for completing exercise', time: '5 hours ago', icon: '⭐' },
                  { action: 'Enrolled in topic', detail: 'Quadratic Equations', time: '1 day ago', icon: '📚' },
                  { action: 'Asked for hint', detail: 'Exercise: Solve for x', time: '2 days ago', icon: '💡' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-foreground-secondary">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-foreground-secondary">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Student Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary text-sm">Grade</span>
                <span className="font-medium">{student.grade}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary text-sm">Grade Band</span>
                <span className="font-medium capitalize">{student.gradeBand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary text-sm">Registered</span>
                <span className="font-medium">{formatDate(student.registeredAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary text-sm">Last Active</span>
                <span className="font-medium">{formatDate(student.lastActive)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-secondary w-full justify-start">
                <span>📧</span>
                Send Email
              </button>
              <button className="btn btn-secondary w-full justify-start">
                <span>🔓</span>
                Unlock Topic
              </button>
              <button className="btn btn-secondary w-full justify-start">
                <span>🔄</span>
                Reset All Quizzes
              </button>
              <button className="btn btn-secondary w-full justify-start text-error hover:bg-error/10">
                <span>🚫</span>
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
