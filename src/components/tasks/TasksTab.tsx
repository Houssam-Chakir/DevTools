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
      <div className="flex items-center gap-2 px-4 py-2 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle border-b border-gh-border-default dark:border-gh-dark-border-default flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gh-fg-muted dark:text-gh-dark-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm w-44 focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg focus:ring-1 focus:ring-gh-accent-fg dark:focus:ring-gh-dark-accent-fg"
          />
        </div>

        {/* Project filter */}
        <select
          value={filterProjectId}
          onChange={(e) => setFilterProjectId(e.target.value)}
          className="px-2 py-1 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Tag filter */}
        <select
          value={filterTagId}
          onChange={(e) => setFilterTagId(e.target.value)}
          className="px-2 py-1 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none"
        >
          <option value="">All labels</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>#{t.name}</option>
          ))}
        </select>

        <div className="flex gap-1.5 ml-auto">
          <button
            onClick={() => setShowProjectManager(true)}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-inset dark:hover:bg-gh-dark-canvas-inset"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
            </svg>
            Projects
          </button>
          <button
            onClick={() => setShowTagManager(true)}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-inset dark:hover:bg-gh-dark-canvas-inset"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Labels
          </button>
          <button
            onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-inset dark:hover:bg-gh-dark-canvas-inset"
          >
            {view === 'kanban' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List view
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Board view
              </>
            )}
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
