'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { currentUser, userStats } from '@/data/users';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/topics', label: 'Topics', icon: '📚' },
  { href: '/capture', label: 'Capture', icon: '📷' },
  { href: '/solve', label: 'AI Tutor', icon: '🤖' },
  { href: '/progress', label: 'Progress', icon: '📊' },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: '⚙️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-[var(--card-border)] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--card-border)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          <span className="font-display font-bold text-lg gradient-text">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-foreground-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* XP Progress */}
      <div className="px-4 py-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground-secondary">Level {userStats.level}</span>
            <span className="text-xs text-primary-500 font-semibold">{userStats.xpPoints} XP</span>
          </div>
          <div className="progress-bar h-2 mb-2">
            <div
              className="progress-bar-fill"
              style={{ width: `${userStats.levelProgress * 100}%` }}
            />
          </div>
          <p className="text-xs text-foreground-secondary">
            {Math.round((userStats.nextLevelXp - userStats.xpPoints))} XP to Level {userStats.level + 1}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1 border-t border-[var(--card-border)]">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-foreground-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="text-lg">{resolvedTheme === 'dark' ? '☀️' : '🌙'}</span>
          {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-2">
        <Link href="/login">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[var(--card-border)]">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(currentUser.firstName, currentUser.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-foreground-secondary truncate">
              {currentUser.email}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
