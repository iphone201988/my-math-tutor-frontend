'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { lessons, exercises } from '@/data/admin-data';
import { cn } from '@/lib/utils';

export default function LessonEditorPage() {
  const params = useParams();
  const { id: topicId, lessonId } = params;
  const [content, setContent] = useState('');

  // Find the lesson
  const topicLessons = lessons['topic-001'] || [];
  const lesson = topicLessons.find(l => l.id === lessonId) || topicLessons[0];
  const lessonExercises = exercises['lesson-002'] || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/admin/topics/${topicId}`}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
              <span>Algebra Basics</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Lesson {lesson?.order || 1}</span>
            </div>
            <h1 className="text-2xl font-bold">{lesson?.title || 'Lesson Title'}</h1>
          </div>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            lesson?.status === 'approved' ? 'bg-success/10 text-success' : 'bg-neutral-200 dark:bg-neutral-700 text-foreground-secondary'
          )}>
            {lesson?.status || 'draft'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <span>👁️</span>
            Preview
          </button>
          <button className="btn btn-primary">
            <span>✅</span>
            Mark Approved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Lesson Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={lesson?.title}
                  className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Time (min)</label>
                <input
                  type="number"
                  defaultValue={lesson?.estimatedTime}
                  className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  defaultValue={lesson?.description}
                  className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Content</h3>
              <div className="flex items-center gap-2">
                <button className="btn btn-secondary btn-sm">
                  <span>🤖</span>
                  Rewrite with AI
                </button>
                <button className="btn btn-secondary btn-sm">
                  <span>🌐</span>
                  Translate
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-t-xl border-b border-[var(--card-border)]">
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-bold">
                B
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors italic">
                I
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors underline">
                U
              </button>
              <div className="w-px h-6 bg-[var(--card-border)] mx-1" />
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                H1
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                H2
              </button>
              <div className="w-px h-6 bg-[var(--card-border)] mx-1" />
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors" title="LaTeX">
                ∑
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors" title="Image">
                🖼️
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors" title="Link">
                🔗
              </button>
            </div>

            {/* Editor Area */}
            <textarea
              value={content || lesson?.content || '# Introduction\n\nStart writing your lesson content here...\n\n## Key Concepts\n\n- Concept 1\n- Concept 2\n\n## Example\n\n$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$'}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] px-4 py-4 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-b-xl focus:outline-none resize-none font-mono"
              placeholder="Write your lesson content in Markdown..."
            />

            <p className="text-xs text-foreground-secondary mt-2">
              Supports Markdown and LaTeX. Use $$ for block equations and $ for inline math.
            </p>
          </div>

          {/* LaTeX Preview */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">LaTeX Preview</h3>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-serif">x = (-b ± √(b² - 4ac)) / 2a</p>
                <p className="text-xs text-foreground-secondary mt-2">Quadratic Formula</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Media */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Media</h3>
            {lesson?.hasImage ? (
              <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-video mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  🖼️
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-8 text-center mb-4">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm text-foreground-secondary">No image yet</p>
              </div>
            )}
            <div className="space-y-2">
              <button className="btn btn-secondary btn-sm w-full">
                <span>🤖</span>
                Generate with AI
              </button>
              <button className="btn btn-secondary btn-sm w-full">
                <span>📤</span>
                Upload Image
              </button>
            </div>
          </div>

          {/* Exercises */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Exercises</h3>
              <button className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {lessonExercises.slice(0, 3).map((ex, index) => (
                <div key={ex.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      ex.difficulty === 'easy' ? 'bg-success/10 text-success' :
                      ex.difficulty === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    )}>
                      {ex.difficulty}
                    </span>
                    <span className="text-xs text-foreground-secondary">{ex.type.toUpperCase()}</span>
                  </div>
                  <p className="text-sm truncate">{ex.question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">
                <span>💾</span>
                Save Changes
              </button>
              <button className="btn btn-secondary w-full">
                <span>✅</span>
                Mark as Approved
              </button>
              <button className="btn btn-secondary w-full text-error hover:bg-error/10">
                <span>🗑️</span>
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
