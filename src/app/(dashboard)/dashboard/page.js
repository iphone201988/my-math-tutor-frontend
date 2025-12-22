import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress, { CircularProgress } from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { currentUser, userStats, recentActivity } from '@/data/users';
import { topics, gradeBands } from '@/data/topics';
import { formatRelativeTime, formatDuration } from '@/lib/utils';

export default function DashboardPage() {
  const recommendedTopics = topics
    .filter(t => t.gradeBand === currentUser.gradeBand && t.status === 'in_progress')
    .slice(0, 3);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">
            Welcome back, {currentUser.firstName}! 👋
          </h1>
          <p className="text-foreground-secondary mt-1">
            Ready to continue your math journey? You&apos;re on a{' '}
            <span className="text-primary-500 font-semibold">{userStats.currentStreak} day streak</span>! 🔥
          </p>
        </div>
        <Link href="/solve">
          <Button size="lg">
            <span className="mr-2">🤖</span>
            Start Learning
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent>
            <p className="text-foreground-secondary text-sm mb-1">Today&apos;s Study</p>
            <p className="text-3xl font-bold">{userStats.todayMinutes}m</p>
            <p className="text-xs text-foreground-secondary mt-1">
              {userStats.weeklyProgress}/{userStats.weeklyGoal}m weekly goal
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent>
            <p className="text-foreground-secondary text-sm mb-1">Problems Solved</p>
            <p className="text-3xl font-bold">{userStats.todayProblems}</p>
            <p className="text-xs text-foreground-secondary mt-1">
              {currentUser.problemsSolved} total
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent>
            <p className="text-foreground-secondary text-sm mb-1">Accuracy</p>
            <p className="text-3xl font-bold">{Math.round(userStats.averageAccuracy * 100)}%</p>
            <p className="text-xs text-foreground-secondary mt-1">
              Top {100 - userStats.rankPercentile}% of learners
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent>
            <p className="text-foreground-secondary text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold">{userStats.currentStreak} 🔥</p>
            <p className="text-xs text-foreground-secondary mt-1">
              Best: {userStats.longestStreak} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <CircularProgress
                  value={userStats.weeklyProgress}
                  max={userStats.weeklyGoal}
                  size={100}
                  strokeWidth={10}
                />
                <div>
                  <p className="text-2xl font-bold">
                    {userStats.weeklyProgress} / {userStats.weeklyGoal} min
                  </p>
                  <p className="text-foreground-secondary text-sm">
                    {userStats.weeklyGoal - userStats.weeklyProgress} minutes to reach your goal
                  </p>
                  <div className="flex gap-2 mt-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div
                        key={day}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i <= 4
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-foreground-secondary'
                          }`}
                        title={day}
                      >
                        {day[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Learning</CardTitle>
              <Link href="/topics" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                View All →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl">
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{topic.title}</h3>
                        <Badge variant="primary">{Math.round(topic.progress * 100)}%</Badge>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {topic.lessonsCount} lessons • {formatDuration(topic.duration)}
                      </p>
                    </div>
                    <div className="w-16">
                      <Progress value={topic.progress} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/capture">
              <Card interactive className="h-full group">
                <CardContent className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                    📸
                  </div>
                  <h3 className="font-semibold mb-1">Snap a Problem</h3>
                  <p className="text-sm text-foreground-secondary">
                    Capture any math problem
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/solve">
              <Card interactive className="h-full group">
                <CardContent className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <h3 className="font-semibold mb-1">Ask AI Tutor</h3>
                  <p className="text-sm text-foreground-secondary">
                    Get step-by-step help
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activity.type === 'lesson_completed' ? 'bg-green-100 dark:bg-green-900/30' :
                      activity.type === 'problem_solved' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        activity.type === 'streak_milestone' ? 'bg-orange-100 dark:bg-orange-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                      {activity.type === 'lesson_completed' ? '✓' :
                        activity.type === 'problem_solved' ? '🧮' :
                          activity.type === 'streak_milestone' ? '🔥' : '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
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

          {/* Level Progress */}
          <Card className="gradient-bg text-white">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl mb-4">
                  🏆
                </div>
                <h3 className="font-bold text-lg mb-1">Level {userStats.level}</h3>
                <p className="text-white/80 text-sm mb-4">
                  {userStats.xpPoints} / {userStats.nextLevelXp} XP
                </p>
                <div className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                    style={{ width: `${userStats.levelProgress * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
