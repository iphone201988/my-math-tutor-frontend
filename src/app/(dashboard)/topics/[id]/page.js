'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import Badge, { DifficultyBadge, StatusBadge } from '@/components/ui/Badge';
import { getTopicById, getLessonsByTopicId, getTopicsByGrade } from '@/data/topics';
import { formatDuration } from '@/lib/utils';

export default function TopicDetailPage() {
    const params = useParams();
    const topic = getTopicById(params.id);
    const lessons = getLessonsByTopicId(params.id);

    if (!topic) {
        return (
            <div className="p-6 lg:p-8">
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
                    <p className="text-foreground-secondary mb-6">The topic you're looking for doesn't exist.</p>
                    <Link href="/topics">
                        <Button>Back to Topics</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const allTopics = getTopicsByGrade(topic.gradeBand);
    const prerequisiteTopics = topic.prerequisites.map(id => allTopics.find(t => t.id === id)).filter(Boolean);
    const completedLessons = lessons.filter(l => l.completed).length;
    const progressPercent = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Back Button */}
            <Link
                href="/topics"
                className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground font-medium transition-colors group"
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Topics
            </Link>

            {/* Header Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Topic Overview */}
                <div className="lg:col-span-2">
                    <Card variant="glass" className="p-8">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-4xl flex-shrink-0 shadow-lg">
                                {topic.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <StatusBadge status={topic.status} />
                                    <DifficultyBadge level={topic.difficulty} />
                                </div>
                                <h1 className="text-3xl font-display font-black mb-3">{topic.title}</h1>
                                <p className="text-foreground-secondary text-lg mb-4">{topic.description}</p>

                                <div className="flex flex-wrap gap-6 text-sm text-foreground-secondary">
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">📚</span>
                                        <strong className="text-foreground">{lessons.length}</strong> lessons
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">⏱️</span>
                                        <strong className="text-foreground">{formatDuration(topic.duration)}</strong> total
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">✅</span>
                                        <strong className="text-foreground">{completedLessons}/{lessons.length}</strong> completed
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {topic.status !== 'not_started' && lessons.length > 0 && (
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-950/30 dark:to-primary-900/20 border border-primary-200/50 dark:border-primary-800/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-lg">Your Progress</span>
                                    <span className="text-2xl font-black text-primary-600">{Math.round(progressPercent)}%</span>
                                </div>
                                <Progress value={progressPercent / 100} size="lg" variant="primary" />
                            </div>
                        )}

                        {topic.status === 'not_started' && (
                            <div className="mt-8">
                                <Button className="w-full btn-lg font-bold">
                                    <span className="text-lg mr-2">🚀</span>
                                    Start Learning
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Prerequisites */}
                    {prerequisiteTopics.length > 0 && (
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>🔗</span> Prerequisites
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {prerequisiteTopics.map(prereq => (
                                    <Link key={prereq.id} href={`/topics/${prereq.id}`}>
                                        <div className="p-3 rounded-xl bg-background-secondary hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors border border-transparent hover:border-primary-300 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{prereq.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{prereq.title}</p>
                                                    <p className="text-xs text-foreground-secondary">
                                                        {prereq.lessonsCount} lessons
                                                    </p>
                                                </div>
                                                <StatusBadge status={prereq.status} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card variant="premium" className="text-center p-6">
                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="font-black text-2xl mb-2">{Math.round(topic.progress * 100)}%</h3>
                            <p className="text-sm text-foreground-secondary font-medium">Overall Mastery</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Lessons Section */}
            <div>
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                    <span>📖</span> Lessons & Activities
                </h2>

                {lessons.length > 0 ? (
                    <div className="grid gap-4">
                        {lessons.map((lesson, index) => (
                            <Card
                                key={lesson.id}
                                variant={lesson.completed ? 'glass' : 'default'}
                                interactive={!lesson.locked}
                                className={`group transition-all duration-300 ${lesson.locked ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                            >
                                <CardContent className="flex items-center gap-6 p-6">
                                    {/* Lesson Number */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 transition-all ${lesson.completed
                                            ? 'bg-success/20 text-success'
                                            : lesson.locked
                                                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                                                : 'bg-primary-500/20 text-primary-600 group-hover:scale-110'
                                        }`}>
                                        {lesson.completed ? '✓' : lesson.locked ? '🔒' : index + 1}
                                    </div>

                                    {/* Lesson Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold mb-1 text-lg ${lesson.locked ? 'text-foreground-secondary' : ''}`}>
                                            {lesson.title}
                                        </h3>
                                        <p className="text-sm text-foreground-secondary flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                ⏱️ {lesson.duration} min
                                            </span>
                                            {lesson.completed && (
                                                <span className="flex items-center gap-1 text-success font-medium">
                                                    ✅ Completed
                                                </span>
                                            )}
                                            {lesson.locked && (
                                                <span className="flex items-center gap-1">
                                                    🔒 Complete previous lessons to unlock
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    {!lesson.locked && (
                                        <Link href={`/solve?topic=${topic.id}&lesson=${lesson.id}`}>
                                            <Button
                                                variant={lesson.completed ? 'secondary' : 'primary'}
                                                className="font-bold"
                                            >
                                                {lesson.completed ? '📖 Review' : '▶️ Start'}
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card variant="glass" className="p-12 text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">Lessons Coming Soon</h3>
                        <p className="text-foreground-secondary">
                            We're working on creating engaging lessons for this topic. Check back soon!
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
