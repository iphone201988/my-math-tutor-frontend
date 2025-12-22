'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { getTopicById, getLessonsByTopicId } from '@/data/topics';
import { getLessonByNumber } from '@/data/lessons';
import { formatDuration } from '@/lib/utils';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const [showAnswer, setShowAnswer] = useState({});
    const [userAnswers, setUserAnswers] = useState({});
    const [currentSection, setCurrentSection] = useState('concept');
    const [isComplete, setIsComplete] = useState(false);

    const topic = getTopicById(params.id);
    const topicLessons = getLessonsByTopicId(params.id);

    // Find current lesson index
    const currentIndex = topicLessons.findIndex(l => l.id.toString() === params.lessonId);
    const lessonMeta = topicLessons[currentIndex];

    // Get detailed lesson content by topic ID and lesson number
    const detailedLesson = getLessonByNumber(params.id, currentIndex + 1);

    const prevLesson = currentIndex > 0 ? topicLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < topicLessons.length - 1 ? topicLessons[currentIndex + 1] : null;

    if (!topic || !lessonMeta) {
        return (
            <div className="p-6 lg:p-8">
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Lesson Not Found</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">The lesson you're looking for doesn't exist.</p>
                    <Link href={`/topics/${params.id}`}>
                        <Button>Back to Topic</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleCheckAnswer = (problemIndex) => {
        setShowAnswer(prev => ({ ...prev, [problemIndex]: true }));
    };

    const handleComplete = () => {
        setIsComplete(true);
        // TODO: Save progress to API
    };

    const sections = [
        { id: 'concept', label: 'Concept', icon: '📖' },
        { id: 'examples', label: 'Examples', icon: '💡' },
        { id: 'practice', label: 'Practice', icon: '✏️' }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-[var(--card-border)]">
                <div className="p-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/topics/${params.id}`}
                            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors group"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to {topic.title}
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Lesson {currentIndex + 1} of {topicLessons.length}
                            </span>
                            <div className="w-32">
                                <Progress value={(currentIndex + 1) / topicLessons.length} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
                {/* Lesson Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-8 lg:p-12 text-white">
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-white/20 text-white border-0">{topic.title}</Badge>
                            <Badge className="bg-white/20 text-white border-0">⏱️ {lessonMeta.duration} min</Badge>
                            {lessonMeta.completed && (
                                <Badge className="bg-green-500/30 text-white border-0">✅ Completed</Badge>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-display font-black mb-4">
                            {lessonMeta.title}
                        </h1>

                        {detailedLesson?.content && (
                            <p className="text-white/80 text-lg max-w-2xl">
                                {detailedLesson.content.substring(0, 150)}...
                            </p>
                        )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute -right-16 top-8 w-24 h-24 rounded-full bg-white/5"></div>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setCurrentSection(section.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${currentSection === section.id
                                ? 'bg-white dark:bg-neutral-700 shadow-md text-primary-600 dark:text-primary-400'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            <span>{section.icon}</span>
                            <span className="hidden sm:inline">{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* Concept Section */}
                {currentSection === 'concept' && (
                    <div className="space-y-6 animate-fade-in">
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-800/50">
                                <CardTitle className="flex items-center gap-3 text-neutral-900 dark:text-white">
                                    <span className="text-2xl">📖</span>
                                    Understanding the Concept
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 lg:p-8">
                                {detailedLesson?.content ? (
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">
                                            {detailedLesson.content}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-4">📝</div>
                                        <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">Content Coming Soon</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            We're working on adding detailed content for this lesson.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button onClick={() => setCurrentSection('examples')}>
                                Continue to Examples →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Examples Section */}
                {currentSection === 'examples' && (
                    <div className="space-y-6 animate-fade-in">
                        <Card>
                            <CardHeader className="border-b border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-800/50">
                                <CardTitle className="flex items-center gap-3 text-neutral-900 dark:text-white">
                                    <span className="text-2xl">💡</span>
                                    Worked Examples
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 lg:p-8">
                                {detailedLesson?.examples && detailedLesson.examples.length > 0 ? (
                                    <div className="space-y-6">
                                        {detailedLesson.examples.map((example, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/40 dark:to-primary-900/20 border border-primary-200 dark:border-primary-800"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-2xl font-mono mb-3 text-neutral-900 dark:text-white p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                                            {example.latex}
                                                        </div>
                                                        <p className="text-neutral-700 dark:text-neutral-300">
                                                            {example.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-4">💡</div>
                                        <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">Examples Coming Soon</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            We're working on adding examples for this lesson.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="secondary" onClick={() => setCurrentSection('concept')}>
                                ← Back to Concept
                            </Button>
                            <Button onClick={() => setCurrentSection('practice')}>
                                Continue to Practice →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Practice Section */}
                {currentSection === 'practice' && (
                    <div className="space-y-6 animate-fade-in">
                        <Card>
                            <CardHeader className="border-b border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-800/50">
                                <CardTitle className="flex items-center gap-3 text-neutral-900 dark:text-white">
                                    <span className="text-2xl">✏️</span>
                                    Practice Problems
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 lg:p-8">
                                {detailedLesson?.practiceProblems && detailedLesson.practiceProblems.length > 0 ? (
                                    <div className="space-y-6">
                                        {detailedLesson.practiceProblems.map((problem, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        Q{index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-lg font-medium mb-4 text-neutral-900 dark:text-white">
                                                            {problem.question}
                                                        </p>

                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Type your answer..."
                                                                value={userAnswers[index] || ''}
                                                                onChange={(e) => setUserAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                                                                className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            />
                                                            <Button
                                                                variant={showAnswer[index] ? 'secondary' : 'primary'}
                                                                onClick={() => handleCheckAnswer(index)}
                                                            >
                                                                {showAnswer[index] ? 'Hide Answer' : 'Check Answer'}
                                                            </Button>
                                                        </div>

                                                        {showAnswer[index] && (
                                                            <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                                                <p className="text-green-800 dark:text-green-300 font-medium">
                                                                    ✅ Answer: <span className="font-mono">{problem.answer}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-4">✏️</div>
                                        <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">Practice Problems Coming Soon</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            We're working on adding practice problems for this lesson.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="secondary" onClick={() => setCurrentSection('examples')}>
                                ← Back to Examples
                            </Button>
                        </div>
                    </div>
                )}

                {/* Completion Card */}
                {isComplete ? (
                    <Card className="text-center overflow-hidden">
                        <CardContent className="py-12">
                            <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
                            <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Lesson Complete!</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Great job! You've mastered this lesson.
                            </p>
                            <div className="flex justify-center gap-4">
                                {nextLesson && !nextLesson.locked && (
                                    <Link href={`/topics/${params.id}/lesson/${nextLesson.id}`}>
                                        <Button>Next Lesson →</Button>
                                    </Link>
                                )}
                                <Link href={`/topics/${params.id}`}>
                                    <Button variant="secondary">Back to Topic</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Navigation Footer */
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex gap-3">
                            {prevLesson && (
                                <Link href={`/topics/${params.id}/lesson/${prevLesson.id}`}>
                                    <Button variant="secondary">
                                        ← Previous
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <Button
                            onClick={handleComplete}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                            ✅ Mark as Complete
                        </Button>

                        <div className="flex gap-3">
                            {nextLesson && !nextLesson.locked ? (
                                <Link href={`/topics/${params.id}/lesson/${nextLesson.id}`}>
                                    <Button>
                                        Next →
                                    </Button>
                                </Link>
                            ) : nextLesson?.locked ? (
                                <Button disabled className="opacity-50 cursor-not-allowed">
                                    🔒 Locked
                                </Button>
                            ) : (
                                <Link href={`/topics/${params.id}`}>
                                    <Button variant="secondary">
                                        Finish Topic
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
