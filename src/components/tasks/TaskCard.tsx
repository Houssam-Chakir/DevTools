import { useState } from 'react';
import type { Task } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { ProjectPill } from '../shared/ProjectPill';
import { TagPill } from '../shared/TagPill';
import { TaskModal } from './TaskModal';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function TaskCard({ task, dragHandleProps }: TaskCardProps) {
  const { projects, tags } = useProjectStore();
  const { deleteTask } = useTaskStore();
  const [showEdit, setShowEdit] = useState(false);

  const project = projects.find((p) => p.id === task.projectId);
  const taskTags = tags.filter((t) => task.tagIds.includes(t.id));
  const urgencyClass = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  }[task.urgency ?? 'medium'];

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 group"
        {...(dragHandleProps ?? {})}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug flex-1">{task.title}</p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setShowEdit(true)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
              title="Edit"
            >✏️</button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
              title="Delete"
            >🗑</button>
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
        )}
        {(project || taskTags.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {project && <ProjectPill project={project} />}
            {taskTags.map((t) => <TagPill key={t.id} tag={t} />)}
          </div>
        )}
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${urgencyClass}`}>
            {(task.urgency ?? 'medium').charAt(0).toUpperCase() + (task.urgency ?? 'medium').slice(1)}
          </span>
        </div>
      </div>
      {showEdit && <TaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  );
}
