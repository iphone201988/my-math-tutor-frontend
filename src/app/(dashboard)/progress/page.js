import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Progress, { CircularProgress } from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { currentUser, userStats, achievements, weeklyStudyData, progressByTopic } from '@/data/users';
import { topics, getTopicById } from '@/data/topics';
import { formatDuration } from '@/lib/utils';

export default function ProgressPage() {
  const topicsWithProgress = progressByTopic.map(p => ({
    ...p,
    topic: getTopicById(p.topicId)
  })).filter(p => p.topic);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
          Your Progress 📊
        </h1>
        <p className="text-foreground-secondary">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-4xl font-bold gradient-text">{userStats.totalTopicsCompleted}</div>
            <p className="text-foreground-secondary text-sm mt-1">Topics Mastered</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-4xl font-bold gradient-text">{currentUser.problemsSolved}</div>
            <p className="text-foreground-secondary text-sm mt-1">Problems Solved</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-4xl font-bold gradient-text">{formatDuration(currentUser.totalMinutesLearned)}</div>
            <p className="text-foreground-secondary text-sm mt-1">Total Study Time</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-4xl font-bold gradient-text">{Math.round(userStats.averageAccuracy * 100)}%</div>
            <p className="text-foreground-secondary text-sm mt-1">Average Accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyStudyData.map((day, i) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all"
                      style={{ 
                        height: `${(day.minutes / 60) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                    <span className="text-xs text-foreground-secondary">{day.day}</span>
                    <span className="text-xs font-medium">{day.minutes}m</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex justify-between text-sm">
                <span className="text-foreground-secondary">
                  Total this week: <strong>{weeklyStudyData.reduce((a, b) => a + b.minutes, 0)} min</strong>
                </span>
                <span className="text-primary-500 font-medium">
                  Goal: {userStats.weeklyGoal} min
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Topic Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topicsWithProgress.map((item) => (
                  <div key={item.topicId} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-lg">
                      {item.topic?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.topic?.title}</span>
                        <span className="text-sm text-primary-500 font-semibold">
                          {Math.round(item.mastery * 100)}%
                        </span>
                      </div>
                      <Progress value={item.mastery} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rank Card */}
          <Card className="gradient-bg text-white">
            <CardContent className="py-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">
                🏆
              </div>
              <h3 className="text-2xl font-bold mb-1">Level {userStats.level}</h3>
              <p className="text-white/80 text-sm mb-1">
                Top {100 - userStats.rankPercentile}% of learners
              </p>
              <p className="text-white/60 text-xs mb-4">
                {userStats.xpPoints} XP earned
              </p>
              <div className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  style={{ width: `${userStats.levelProgress * 100}%` }}
                />
              </div>
              <p className="text-white/60 text-xs mt-2">
                {Math.round((userStats.nextLevelXp - userStats.xpPoints))} XP to next level
              </p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 opacity-50 grayscale'
                    }`}
                    title={ach.title}
                  >
                    {ach.icon}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-foreground-secondary mt-4">
                {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
              </p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-5xl mb-3">🔥</div>
              <div className="text-3xl font-bold">{userStats.currentStreak} Days</div>
              <p className="text-foreground-secondary text-sm">Current Streak</p>
              <p className="text-xs text-foreground-secondary mt-2">
                Best: {userStats.longestStreak} days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
