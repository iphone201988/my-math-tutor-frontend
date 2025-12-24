'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminHeader() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      const isLast = index === paths.length - 1;
      return { label, isLast };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="fixed top-0 right-0 left-72 h-[72px] bg-background/80 backdrop-blur-xl border-b border-[var(--card-border)] z-30 flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <svg className="w-4 h-4 text-foreground-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span className={cn(
              'text-sm',
              crumb.isLast ? 'font-semibold text-foreground' : 'text-foreground-secondary'
            )}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-4 py-2 pl-10 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Quick Actions */}
        <button className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative group">
          <span className="text-xl">➕</span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Quick Create
          </span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
          }}
          className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="text-xl dark:hidden">🌙</span>
          <span className="text-xl hidden dark:inline">☀️</span>
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xs">
            SA
          </div>
          <svg className="w-4 h-4 text-foreground-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
