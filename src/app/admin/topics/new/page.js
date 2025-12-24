'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { topics, GRADE_BANDS, DIFFICULTY_LEVELS } from '@/data/admin-data';
import { cn } from '@/lib/utils';

export default function NewTopicPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        gradeBand: '',
        difficulty: '',
        subject: 'Mathematics',
        prerequisite: '',
        creationMethod: 'ai',
    });

    // Learning objectives state
    const [objectives, setObjectives] = useState(['']);

    // AI settings state
    const [aiSettings, setAiSettings] = useState({
        lessonsCount: 6,
        exercisesPerLesson: 4,
        quizQuestions: 10,
        generateImages: true,
        includeLatex: true,
    });

    // Generation steps for progress
    const GENERATION_STEPS = [
        { label: 'Analyzing topic structure...', icon: '🔍' },
        { label: 'Generating lesson content...', icon: '📖' },
        { label: 'Creating practice exercises...', icon: '✏️' },
        { label: 'Building quiz questions...', icon: '📝' },
        { label: 'Generating images...', icon: '🖼️' },
        { label: 'Finalizing topic...', icon: '✅' },
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle objective changes
    const handleObjectiveChange = (index, value) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        setObjectives(newObjectives);
    };

    const addObjective = () => {
        setObjectives([...objectives, '']);
    };

    const removeObjective = (index) => {
        if (objectives.length > 1) {
            setObjectives(objectives.filter((_, i) => i !== index));
        }
    };

    // Suggest objectives with AI (simulation)
    const suggestObjectives = () => {
        const suggestions = [
            'Understand the fundamental concepts and definitions',
            'Apply learned techniques to solve practical problems',
            'Analyze and interpret mathematical expressions',
            'Demonstrate proficiency through practice exercises',
        ];
        setObjectives(suggestions);
    };

    // Handle AI generation
    const handleAIGenerate = async () => {
        if (!formData.title || !formData.gradeBand || !formData.difficulty) {
            alert('Please fill in the required fields (Title, Grade Band, Difficulty)');
            return;
        }

        setIsGenerating(true);
        setGenerationStep(0);

        // Simulate generation progress
        for (let i = 0; i < GENERATION_STEPS.length; i++) {
            setGenerationStep(i);
            await new Promise(resolve => setTimeout(resolve, 1200));
        }

        setIsGenerating(false);
        setShowSuccess(true);

        // Redirect after showing success
        setTimeout(() => {
            router.push('/admin/topics');
        }, 2000);
    };

    // Handle manual creation (save as draft)
    const handleSaveAsDraft = async () => {
        if (!formData.title) {
            alert('Please enter a topic title');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setShowSuccess(true);

        setTimeout(() => {
            router.push('/admin/topics');
        }, 1500);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (formData.creationMethod === 'ai') {
            handleAIGenerate();
        } else {
            handleSaveAsDraft();
        }
    };

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

            {/* Success Message */}
            {showSuccess && (
                <div className="glass-card p-6 border-success/50 bg-success/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-success">Topic Created Successfully!</h3>
                            <p className="text-sm text-foreground-secondary">Redirecting to topics list...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Generation Progress Modal */}
            {isGenerating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl animate-bounce">🤖</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Generating Content with AI</h3>
                            <p className="text-foreground-secondary text-sm">
                                Creating {aiSettings.lessonsCount} lessons with {aiSettings.exercisesPerLesson} exercises each...
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="space-y-3">
                            {GENERATION_STEPS.map((step, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all',
                                        index < generationStep ? 'bg-success text-white' :
                                            index === generationStep ? 'bg-primary-500 text-white animate-pulse' :
                                                'bg-neutral-200 dark:bg-neutral-700 text-foreground-secondary'
                                    )}>
                                        {index < generationStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span>{step.icon}</span>
                                        )}
                                    </div>
                                    <span className={cn(
                                        'text-sm transition-colors',
                                        index <= generationStep ? 'text-foreground' : 'text-foreground-secondary'
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                                    style={{ width: `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-foreground-secondary text-center mt-2">
                                Step {generationStep + 1} of {GENERATION_STEPS.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className="glass-card p-6 space-y-6">
                {/* Basic Info */}
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-xs font-bold">1</span>
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Topic Title <span className="text-error">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Introduction to Trigonometry"
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>

                        {/* Subtitle */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                placeholder="e.g., Learn sine, cosine, and tangent functions"
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>

                        {/* Grade Band */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Grade Band <span className="text-error">*</span></label>
                            <select
                                name="gradeBand"
                                value={formData.gradeBand}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                            >
                                <option value="">Select grade band...</option>
                                {Object.entries(GRADE_BANDS).map(([key, band]) => (
                                    <option key={key} value={band.id}>{band.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty Level <span className="text-error">*</span></label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                            >
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
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>

                        {/* Prerequisites */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Prerequisite Topic</label>
                            <select
                                name="prerequisite"
                                value={formData.prerequisite}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                            >
                                <option value="">None</option>
                                {topics.filter(t => t.status === 'published').map((topic) => (
                                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Learning Objectives */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-xs font-bold">2</span>
                            Learning Objectives
                        </h3>
                        <button
                            onClick={suggestObjectives}
                            className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
                        >
                            <span>🤖</span>
                            Suggest with AI
                        </button>
                    </div>
                    <div className="space-y-2">
                        {objectives.map((objective, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-foreground-secondary w-6 text-center">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={objective}
                                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                    placeholder="Enter a learning objective..."
                                    className="flex-1 px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                                <button
                                    onClick={() => removeObjective(index)}
                                    disabled={objectives.length === 1}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        objectives.length === 1
                                            ? "text-foreground-secondary/30 cursor-not-allowed"
                                            : "hover:bg-error/10 text-foreground-secondary hover:text-error"
                                    )}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addObjective}
                            className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1 mt-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Objective
                        </button>
                    </div>
                </div>

                {/* Content Creation Method */}
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-xs font-bold">3</span>
                        Content Creation Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, creationMethod: 'ai' }))}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all text-left",
                                formData.creationMethod === 'ai'
                                    ? "border-primary-500 bg-primary-500/10"
                                    : "border-transparent bg-neutral-50 dark:bg-neutral-800/50 hover:border-primary-500/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    formData.creationMethod === 'ai' ? "bg-primary-500/20" : "bg-primary-500/10"
                                )}>
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <p className="font-medium">Generate with AI</p>
                                    <p className="text-xs text-foreground-secondary">AI creates lessons, exercises, and quizzes automatically</p>
                                </div>
                                {formData.creationMethod === 'ai' && (
                                    <svg className="w-5 h-5 text-primary-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                )}
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, creationMethod: 'manual' }))}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all text-left",
                                formData.creationMethod === 'manual'
                                    ? "border-secondary-500 bg-secondary-500/10"
                                    : "border-transparent bg-neutral-50 dark:bg-neutral-800/50 hover:border-secondary-500/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    formData.creationMethod === 'manual' ? "bg-secondary-500/20" : "bg-secondary-500/10"
                                )}>
                                    <span className="text-2xl">✏️</span>
                                </div>
                                <div>
                                    <p className="font-medium">Create Manually</p>
                                    <p className="text-xs text-foreground-secondary">Write content yourself from scratch</p>
                                </div>
                                {formData.creationMethod === 'manual' && (
                                    <svg className="w-5 h-5 text-secondary-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* AI Generation Settings - Only show when AI method selected */}
                {formData.creationMethod === 'ai' && (
                    <div className="p-5 rounded-xl bg-primary-500/5 border border-primary-500/20">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <span>🤖</span>
                            AI Generation Settings
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Number of Lessons</label>
                                <input
                                    type="number"
                                    value={aiSettings.lessonsCount}
                                    onChange={(e) => setAiSettings(prev => ({ ...prev, lessonsCount: parseInt(e.target.value) || 6 }))}
                                    min={3}
                                    max={15}
                                    className="w-full px-4 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                                />
                                <p className="text-xs text-foreground-secondary mt-1">3-15 lessons</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Exercises per Lesson</label>
                                <input
                                    type="number"
                                    value={aiSettings.exercisesPerLesson}
                                    onChange={(e) => setAiSettings(prev => ({ ...prev, exercisesPerLesson: parseInt(e.target.value) || 4 }))}
                                    min={2}
                                    max={10}
                                    className="w-full px-4 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                                />
                                <p className="text-xs text-foreground-secondary mt-1">2-10 exercises</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Quiz Questions</label>
                                <input
                                    type="number"
                                    value={aiSettings.quizQuestions}
                                    onChange={(e) => setAiSettings(prev => ({ ...prev, quizQuestions: parseInt(e.target.value) || 10 }))}
                                    min={5}
                                    max={20}
                                    className="w-full px-4 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                                />
                                <p className="text-xs text-foreground-secondary mt-1">5-20 questions</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aiSettings.generateImages}
                                    onChange={(e) => setAiSettings(prev => ({ ...prev, generateImages: e.target.checked }))}
                                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm">Generate images with AI</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aiSettings.includeLatex}
                                    onChange={(e) => setAiSettings(prev => ({ ...prev, includeLatex: e.target.checked }))}
                                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm">Include LaTeX math expressions</span>
                            </label>
                        </div>

                        {/* Estimated Output */}
                        <div className="mt-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            <p className="text-xs text-foreground-secondary">
                                <span className="font-medium">Estimated output:</span> {aiSettings.lessonsCount} lessons, {aiSettings.lessonsCount * aiSettings.exercisesPerLesson} exercises, {aiSettings.quizQuestions} quiz questions
                                {aiSettings.generateImages && `, ~${aiSettings.lessonsCount * 2} images`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Manual Creation Info - Only show when manual method selected */}
                {formData.creationMethod === 'manual' && (
                    <div className="p-5 rounded-xl bg-secondary-500/5 border border-secondary-500/20">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                            <span>✏️</span>
                            Manual Creation
                        </h4>
                        <p className="text-sm text-foreground-secondary mb-3">
                            Your topic will be saved as a draft. You can then add lessons, exercises, and quizzes manually through the topic editor.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-foreground-secondary">You can always use AI generation later from the topic editor.</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--card-border)]">
                    <Link href="/admin/topics" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <div className="flex items-center gap-3">
                        {formData.creationMethod === 'ai' ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || isGenerating || !formData.title}
                                className="btn btn-primary"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span>🤖</span>
                                        Create & Generate Content
                                    </>
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSaveAsDraft}
                                    disabled={isSubmitting || !formData.title}
                                    className="btn btn-primary"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Save as Draft
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
