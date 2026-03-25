type Tab = 'tasks' | 'notes' | 'translate' | 'space';

interface TabNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'notes', label: 'Notes', icon: '📝' },
  { id: 'translate', label: 'Translate', icon: '🌐' },
  { id: 'space', label: 'Space', icon: '🗂' },
];

export function TabNav({ activeTab, setActiveTab }: TabNavProps) {
  return (
    <nav className="flex bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
