'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import Badge, { DifficultyBadge, StatusBadge } from '@/components/ui/Badge';
import { topics, gradeBands, getTopicsByGrade } from '@/data/topics';
import { formatDuration } from '@/lib/utils';
import { currentUser } from '@/data/users';

export default function TopicsPage() {
  const [selectedBand, setSelectedBand] = useState(currentUser.gradeBand);
  const filteredTopics = getTopicsByGrade(selectedBand);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
          Explore Topics 📚
        </h1>
        <p className="text-foreground-secondary">
          Master mathematics from fundamentals to advanced concepts
        </p>
      </div>

      {/* Grade Band Selector */}
      <div className="flex flex-wrap gap-3">
        {gradeBands.map((band) => (
          <button
            key={band.id}
            onClick={() => setSelectedBand(band.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              selectedBand === band.id
                ? 'bg-gradient-to-r ' + band.color + ' text-white shadow-lg'
                : 'bg-card-bg border border-[var(--card-border)] hover:border-primary-300'
            }`}
          >
            <span className="text-xl">{band.icon}</span>
            <span>{band.label}</span>
            <span className="text-sm opacity-80">({band.grades})</span>
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.id}`}>
            <Card interactive className="h-full group">
              <CardContent className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </div>
                  <StatusBadge status={topic.status} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                <p className="text-sm text-foreground-secondary mb-4 flex-1">
                  {topic.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4 text-sm text-foreground-secondary">
                  <span className="flex items-center gap-1">
                    📖 {topic.lessonsCount} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {formatDuration(topic.duration)}
                  </span>
                </div>

                {/* Progress */}
                {topic.status !== 'not_started' && (
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-primary-500 font-semibold">
                        {Math.round(topic.progress * 100)}%
                      </span>
                    </div>
                    <Progress value={topic.progress} size="md" />
                  </div>
                )}

                {topic.status === 'not_started' && (
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <DifficultyBadge level={topic.difficulty} />
                      <span className="text-sm text-primary-500 font-medium flex items-center gap-1">
                        Start Learning →
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">No topics found</h3>
          <p className="text-foreground-secondary mb-4">
            Try selecting a different grade level
          </p>
        </div>
      )}
    </div>
  );
}
