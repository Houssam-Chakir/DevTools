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

interface ListViewProps {
  search: string;
  filterProjectId: string;
  filterTagId: string;
}

export function ListView({ search, filterProjectId, filterTagId }: ListViewProps) {
  const { tasks, deleteTask } = useTaskStore();
  const { projects, tags } = useProjectStore();
  const [editTask, setEditTask] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProjectId && t.projectId !== filterProjectId) return false;
    if (filterTagId && !t.tagIds.includes(filterTagId)) return false;
    return true;
  });

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {statuses.map((status) => {
        const statusTasks = filteredTasks.filter((t) => t.status === status);
        if (statusTasks.length === 0) return null;
        return (
          <div key={status}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {STATUS_LABELS[status]}
              <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                {statusTasks.length}
              </span>
            </h3>
            <div className="space-y-2">
              {statusTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const taskTags = tags.filter((t) => task.tagIds.includes(t.id));
                const urgency = task.urgency ?? 'medium';
                const urgencyClass = {
                  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
                }[urgency];
                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{task.description}</p>
                      )}
                       <div className="flex flex-wrap gap-1 mt-1">
                         {project && <ProjectPill project={project} />}
                         {taskTags.map((t) => <TagPill key={t.id} tag={t} />)}
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${urgencyClass}`}>
                           {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                         </span>
                       </div>
                     </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setEditTask(task.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                      >✏️</button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                      >🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {editTask && (
        <TaskModal
          task={tasks.find((t) => t.id === editTask)}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
}
