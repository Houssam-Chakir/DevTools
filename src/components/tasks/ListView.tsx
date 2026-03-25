import { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import type { TaskStatus } from '../../types';
import { ProjectPill } from '../shared/ProjectPill';
import { TagPill } from '../shared/TagPill';
import { TaskModal } from './TaskModal';

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  'todo': 'bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset text-gh-fg-muted dark:text-gh-dark-fg-muted border border-gh-border-default dark:border-gh-dark-border-default',
  'in-progress': 'bg-gh-accent-subtle dark:bg-gh-dark-accent-subtle text-gh-accent-fg dark:text-gh-dark-accent-fg border border-gh-accent-fg/30 dark:border-gh-dark-accent-fg/30',
  'done': 'bg-gh-done-subtle dark:bg-gh-dark-done-subtle text-gh-done-fg dark:text-gh-dark-done-fg border border-gh-done-fg/30 dark:border-gh-dark-done-fg/30',
};

const URGENCY_STYLES = {
  low: 'bg-gh-success-subtle dark:bg-gh-dark-success-subtle text-gh-success-fg dark:text-gh-dark-success-fg border border-gh-success-fg/20',
  medium: 'bg-gh-attention-subtle dark:bg-gh-dark-attention-subtle text-gh-attention-fg dark:text-gh-dark-attention-fg border border-gh-attention-fg/20',
  high: 'bg-gh-danger-subtle dark:bg-gh-dark-danger-subtle text-gh-danger-fg dark:text-gh-dark-danger-fg border border-gh-danger-fg/20',
};

interface ListViewProps {
  search: string;
  filterProjectId: string;
  filterTagId: string;
}

export function ListView({ search, filterProjectId, filterTagId }: ListViewProps) {
  const { tasks, deleteTask, updateTask } = useTaskStore();
  const { projects, tags } = useProjectStore();
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [addSubtaskForId, setAddSubtaskForId] = useState<string | null>(null);
  const [expandedSubtasks, setExpandedSubtasks] = useState<Set<string>>(new Set());

  const rootTasks = tasks.filter((t) => {
    if (t.parentTaskId) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProjectId && t.projectId !== filterProjectId) return false;
    if (filterTagId && !t.tagIds.includes(filterTagId)) return false;
    return true;
  });

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];

  const toggleExpand = (id: string) => {
    setExpandedSubtasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default space-y-4">
      {statuses.map((status) => {
        const statusTasks = rootTasks.filter((t) => t.status === status);
        if (statusTasks.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default uppercase tracking-wide">
                {STATUS_LABELS[status]}
              </h3>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status]}`}>
                {statusTasks.length}
              </span>
            </div>
            <div className="rounded-md border border-gh-border-default dark:border-gh-dark-border-default overflow-hidden bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle divide-y divide-gh-border-default dark:divide-gh-dark-border-default">
              {statusTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const taskTags = tags.filter((t) => task.tagIds.includes(t.id));
                const urgency = task.urgency ?? 'medium';
                const urgencyClass = URGENCY_STYLES[urgency];
                const subtasks = tasks.filter((t) => t.parentTaskId === task.id);
                const doneSubtasks = subtasks.filter((t) => t.status === 'done').length;
                const isExpanded = expandedSubtasks.has(task.id);

                return (
                  <div key={task.id}>
                    <div className="flex items-center gap-3 px-4 py-2.5 group hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gh-fg-default dark:text-gh-dark-fg-default">{task.title}</p>
                          {project && <ProjectPill project={project} />}
                          {taskTags.map((t) => <TagPill key={t.id} tag={t} />)}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${urgencyClass}`}>
                            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                          </span>
                          {subtasks.length > 0 && (
                            <button
                              onClick={() => toggleExpand(task.id)}
                              className="flex items-center gap-1 text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-accent-fg dark:hover:text-gh-dark-accent-fg"
                            >
                              <svg
                                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {doneSubtasks}/{subtasks.length}
                            </button>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted truncate mt-0.5">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                        <button
                          onClick={() => setAddSubtaskForId(task.id)}
                          className="p-1 rounded-md hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default text-gh-fg-muted dark:text-gh-dark-fg-muted"
                          title="Add subtask"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditTaskId(task.id)}
                          className="p-1 rounded-md hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default text-gh-fg-muted dark:text-gh-dark-fg-muted"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded-md hover:bg-gh-danger-subtle dark:hover:bg-gh-dark-danger-subtle text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-danger-fg dark:hover:text-gh-dark-danger-fg"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Subtasks (expanded) */}
                    {isExpanded && subtasks.length > 0 && (
                      <div className="bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset border-t border-gh-border-muted dark:border-gh-dark-border-muted divide-y divide-gh-border-muted dark:divide-gh-dark-border-muted">
                        {subtasks.map((subtask) => {
                          const isDone = subtask.status === 'done';
                          return (
                            <div key={subtask.id} className="flex items-center gap-3 pl-8 pr-4 py-2 group/sub hover:bg-gh-canvas-default dark:hover:bg-gh-dark-canvas-subtle">
                              <button
                                onClick={() => updateTask(subtask.id, { status: isDone ? 'todo' : 'done' })}
                                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis border-gh-success-emphasis dark:border-gh-dark-success-emphasis'
                                    : 'border-gh-border-default dark:border-gh-dark-border-default hover:border-gh-success-emphasis dark:hover:border-gh-dark-success-emphasis'
                                }`}
                              >
                                {isDone && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <span className={`flex-1 text-xs ${isDone ? 'line-through text-gh-fg-muted dark:text-gh-dark-fg-muted' : 'text-gh-fg-default dark:text-gh-dark-fg-default'}`}>
                                {subtask.title}
                              </span>
                              <div className="flex gap-0.5 opacity-0 group-hover/sub:opacity-100">
                                <button
                                  onClick={() => setEditTaskId(subtask.id)}
                                  className="p-0.5 rounded text-gh-fg-muted dark:text-gh-dark-fg-muted hover:bg-gh-canvas-default dark:hover:bg-gh-dark-canvas-subtle"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteTask(subtask.id)}
                                  className="p-0.5 rounded text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-danger-fg dark:hover:text-gh-dark-danger-fg"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {editTaskId && (
        <TaskModal
          task={tasks.find((t) => t.id === editTaskId)}
          onClose={() => setEditTaskId(null)}
        />
      )}
      {addSubtaskForId && (
        <TaskModal
          defaultStatus="todo"
          parentTaskId={addSubtaskForId}
          onClose={() => setAddSubtaskForId(null)}
        />
      )}
    </div>
  );
}
