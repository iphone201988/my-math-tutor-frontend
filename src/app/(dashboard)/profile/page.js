'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { currentUser, userStats, achievements, recentActivity } from '@/data/users';
import { gradeBands } from '@/data/topics';
import { getInitials, formatRelativeTime, formatDuration } from '@/lib/utils';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
    });

    const currentGradeBand = gradeBands.find(b => b.id === currentUser.gradeBand);
    const unlockedAchievements = achievements.filter(a => a.unlocked);

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                        My Profile 👤
                    </h1>
                    <p className="text-foreground-secondary">
                        View and manage your profile information
                    </p>
                </div>
                <Link href="/settings">
                    <Button variant="secondary">
                        ⚙️ Settings
                    </Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Main Profile */}
                    <Card className="text-center">
                        <CardContent className="py-8">
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl mx-auto">
                                    {getInitials(currentUser.firstName, currentUser.lastName)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                                    <span className="text-xs">✓</span>
                                </div>
                            </div>

                            {/* Name & Email */}
                            <h2 className="text-xl font-bold">
                                {currentUser.firstName} {currentUser.lastName}
                            </h2>
                            <p className="text-foreground-secondary text-sm mb-4">
                                {currentUser.email}
                            </p>

                            {/* Grade Band */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30">
                                <span className="text-lg">{currentGradeBand?.icon}</span>
                                <span className="font-medium text-primary-700 dark:text-primary-300">
                                    {currentGradeBand?.label} Level
                                </span>
                            </div>

                            {/* Subscription */}
                            <div className="mt-4">
                                <Badge variant={currentUser.subscriptionTier === 'premium' ? 'primary' : 'secondary'}>
                                    {currentUser.subscriptionTier === 'premium' ? '💎 Premium' : '🆓 Free'} Member
                                </Badge>
                            </div>

                            {/* Member Since */}
                            <p className="text-xs text-foreground-secondary mt-4">
                                Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Level Card */}
                    <Card className="gradient-bg text-white">
                        <CardContent className="py-6 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl mb-3">
                                🏆
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Level {userStats.level}</h3>
                            <p className="text-white/80 text-sm mb-4">
                                {userStats.xpPoints} XP Total
                            </p>
                            <div className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                                    style={{ width: `${userStats.levelProgress * 100}%` }}
                                />
                            </div>
                            <p className="text-white/60 text-xs">
                                {Math.round((userStats.nextLevelXp - userStats.xpPoints))} XP to Level {userStats.level + 1}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Streak Card */}
                    <Card>
                        <CardContent className="py-6 text-center">
                            <div className="text-5xl mb-2">🔥</div>
                            <div className="text-3xl font-bold gradient-text">{userStats.currentStreak}</div>
                            <p className="text-foreground-secondary text-sm">Day Streak</p>
                            <div className="mt-4 pt-4 border-t border-[var(--card-border)] text-sm">
                                <div className="flex justify-between text-foreground-secondary">
                                    <span>Best Streak:</span>
                                    <span className="font-semibold text-foreground">{userStats.longestStreak} days</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="text-center">
                            <CardContent className="py-4">
                                <div className="text-2xl font-bold gradient-text">{currentUser.problemsSolved}</div>
                                <p className="text-xs text-foreground-secondary">Problems Solved</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="py-4">
                                <div className="text-2xl font-bold gradient-text">{formatDuration(currentUser.totalMinutesLearned)}</div>
                                <p className="text-xs text-foreground-secondary">Study Time</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="py-4">
                                <div className="text-2xl font-bold gradient-text">{Math.round(currentUser.accuracy * 100)}%</div>
                                <p className="text-xs text-foreground-secondary">Accuracy</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="py-4">
                                <div className="text-2xl font-bold gradient-text">{userStats.totalTopicsCompleted}</div>
                                <p className="text-xs text-foreground-secondary">Topics Mastered</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Edit Profile */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Profile Information</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? '✕ Cancel' : '✎ Edit'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                        <Input
                                            label="Last Name"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <div className="flex gap-3">
                                        <Button type="submit">Save Changes</Button>
                                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-foreground-secondary mb-1">First Name</p>
                                            <p className="font-medium">{currentUser.firstName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-secondary mb-1">Last Name</p>
                                            <p className="font-medium">{currentUser.lastName}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-secondary mb-1">Email</p>
                                        <p className="font-medium">{currentUser.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-secondary mb-1">Learning Level</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <span>{currentGradeBand?.icon}</span>
                                            {currentGradeBand?.label} (Grades {currentGradeBand?.grades})
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-secondary mb-1">Language</p>
                                        <p className="font-medium">🇺🇸 English</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Achievements */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Achievements</CardTitle>
                            <span className="text-sm text-foreground-secondary">
                                {unlockedAchievements.length}/{achievements.length} unlocked
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {achievements.slice(0, 8).map((ach) => (
                                    <div
                                        key={ach.id}
                                        className={`p-4 rounded-xl text-center transition-all ${ach.unlocked
                                            ? 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30'
                                            : 'bg-neutral-100 dark:bg-neutral-800 opacity-50'
                                            }`}
                                    >
                                        <div className={`text-3xl mb-2 ${!ach.unlocked && 'grayscale'}`}>
                                            {ach.icon}
                                        </div>
                                        <p className={`text-xs font-medium ${ach.unlocked ? '' : 'text-foreground-secondary'}`}>
                                            {ach.title}
                                        </p>
                                        {!ach.unlocked && ach.progress !== undefined && (
                                            <div className="mt-2">
                                                <Progress value={ach.progress} size="sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.slice(0, 5).map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${activity.type === 'lesson_completed' ? 'bg-green-100 dark:bg-green-900/30' :
                                            activity.type === 'problem_solved' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                activity.type === 'streak_milestone' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    'bg-purple-100 dark:bg-purple-900/30'
                                            }`}>
                                            {activity.type === 'lesson_completed' ? '✓' :
                                                activity.type === 'problem_solved' ? '🧮' :
                                                    activity.type === 'streak_milestone' ? '🔥' : '🏆'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            <p className="text-xs text-foreground-secondary">
                                                {formatRelativeTime(activity.timestamp)}
                                            </p>
                                        </div>
                                        <Badge variant="success" className="text-xs">
                                            +{activity.xpEarned} XP
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
