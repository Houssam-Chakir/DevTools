import { useState } from 'react';
import { TabNav } from './TabNav';
import { TasksTab } from '../tasks/TasksTab';
import { NotesTab } from '../notes/NotesTab';
import { TranslateTab } from '../translate/TranslateTab';
import { SpaceTab } from '../space/SpaceTab';
import { useTheme } from '../../hooks/useTheme';

type Tab = 'tasks' | 'notes' | 'translate' | 'space';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const { isDark, toggle } = useTheme();

  return (
    <div className="h-screen flex flex-col bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default">
      <header className="flex items-center justify-between px-4 py-2 bg-gh-header-bg border-b border-gh-header-border shrink-0">
        <div className="flex items-center gap-3">
          {/* GitHub-style Octocat-like logo */}
          <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 2C8.27 2 2 8.27 2 16c0 6.18 4.01 11.42 9.57 13.27.7.13.96-.3.96-.67v-2.34c-3.9.85-4.72-1.88-4.72-1.88-.64-1.62-1.56-2.05-1.56-2.05-1.27-.87.1-.85.1-.85 1.4.1 2.14 1.44 2.14 1.44 1.25 2.14 3.27 1.52 4.07 1.16.13-.9.49-1.52.89-1.87-3.11-.35-6.38-1.56-6.38-6.93 0-1.53.55-2.78 1.44-3.76-.14-.35-.62-1.78.14-3.71 0 0 1.17-.37 3.85 1.44A13.38 13.38 0 0116 9.07c1.19.01 2.39.16 3.51.47 2.67-1.81 3.85-1.44 3.85-1.44.76 1.93.28 3.36.14 3.71.9.98 1.44 2.23 1.44 3.76 0 5.38-3.28 6.57-6.4 6.92.5.43.95 1.29.95 2.6v3.85c0 .37.25.81.96.67C25.99 27.42 30 22.18 30 16 30 8.27 23.73 2 16 2z"/>
          </svg>
          <h1 className="text-base font-semibold text-white">DevTools</h1>
        </div>
        <button
          onClick={toggle}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'translate' && <TranslateTab />}
        {activeTab === 'space' && <SpaceTab />}
      </main>
    </div>
  );
}
