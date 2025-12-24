'use client';

import Link from 'next/link';
import { topics, GRADE_BANDS, DIFFICULTY_LEVELS } from '@/data/admin-data';
import { cn } from '@/lib/utils';

export default function NewTopicPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/topics"
          className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Topic</h1>
          <p className="text-foreground-secondary">Add a new curriculum topic</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Topic Title *</label>
            <input
              type="text"
              placeholder="e.g., Introduction to Trigonometry"
              className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Subtitle */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              placeholder="e.g., Learn sine, cosine, and tangent functions"
              className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Grade Band */}
          <div>
            <label className="block text-sm font-medium mb-2">Grade Band *</label>
            <select className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all">
              <option value="">Select grade band...</option>
              {Object.entries(GRADE_BANDS).map(([key, band]) => (
                <option key={key} value={band.id}>{band.label}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Level *</label>
            <select className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all">
              <option value="">Select difficulty...</option>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                <option key={key} value={level.id}>{level.label}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              defaultValue="Mathematics"
              className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium mb-2">Prerequisites</label>
            <select className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all">
              <option value="">None</option>
              {topics.filter(t => t.status === 'published').map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Learning Objectives</label>
            <button className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
              <span>🤖</span>
              Suggest with AI
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-foreground-secondary">•</span>
              <input
                type="text"
                placeholder="Enter a learning objective..."
                className="flex-1 px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <button className="p-2 rounded-lg hover:bg-error/10 text-foreground-secondary hover:text-error transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
              <span>➕</span>
              Add Objective
            </button>
          </div>
        </div>

        {/* Content Creation Method */}
        <div>
          <label className="block text-sm font-medium mb-3">Content Creation Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent hover:border-primary-500/50 transition-colors cursor-pointer has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500/10">
              <input type="radio" name="method" value="ai" className="sr-only" defaultChecked />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <p className="font-medium">Generate with AI</p>
                  <p className="text-xs text-foreground-secondary">AI creates lessons, exercises, and quizzes</p>
                </div>
              </div>
            </label>
            <label className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent hover:border-primary-500/50 transition-colors cursor-pointer has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500/10">
              <input type="radio" name="method" value="manual" className="sr-only" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                  <span className="text-2xl">✏️</span>
                </div>
                <div>
                  <p className="font-medium">Create Manually</p>
                  <p className="text-xs text-foreground-secondary">Write content yourself from scratch</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* AI Generation Options */}
        <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
          <h4 className="font-medium mb-4">AI Generation Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Lessons</label>
              <input
                type="number"
                defaultValue={6}
                min={3}
                max={15}
                className="w-full px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Exercises per Lesson</label>
              <input
                type="number"
                defaultValue={4}
                min={2}
                max={10}
                className="w-full px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Questions</label>
              <input
                type="number"
                defaultValue={10}
                min={5}
                max={20}
                className="w-full px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
              <span className="text-sm">Generate images</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
              <span className="text-sm">Include LaTeX math expressions</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--card-border)]">
          <Link href="/admin/topics" className="btn btn-secondary">
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary">
              Save as Draft
            </button>
            <button className="btn btn-primary">
              <span>🤖</span>
              Create & Generate Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
