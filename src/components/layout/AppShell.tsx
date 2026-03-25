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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DevTools</h1>
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
