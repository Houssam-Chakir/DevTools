import { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { ListView } from './ListView';
import { useProjectStore } from '../../store/projectStore';
import { ProjectManager } from '../shared/ProjectManager';
import { TagManager } from '../shared/TagManager';

export function TasksTab() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterTagId, setFilterTagId] = useState('');
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const { projects, tags } = useProjectStore();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-wrap">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm w-48"
        />
        <select
          value={filterProjectId}
          onChange={(e) => setFilterProjectId(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          value={filterTagId}
          onChange={(e) => setFilterTagId(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>#{t.name}</option>
          ))}
        </select>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setShowProjectManager(true)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Projects
          </button>
          <button
            onClick={() => setShowTagManager(true)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Tags
          </button>
          <button
            onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
            className="px-3 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
          >
            {view === 'kanban' ? 'List View' : 'Kanban View'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {view === 'kanban' ? (
          <KanbanBoard search={search} filterProjectId={filterProjectId} filterTagId={filterTagId} />
        ) : (
          <ListView search={search} filterProjectId={filterProjectId} filterTagId={filterTagId} />
        )}
      </div>
      {showProjectManager && <ProjectManager onClose={() => setShowProjectManager(false)} />}
      {showTagManager && <TagManager onClose={() => setShowTagManager(false)} />}
    </div>
  );
}
