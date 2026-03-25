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

const URGENCY_STYLES = {
  low: 'bg-gh-success-subtle dark:bg-gh-dark-success-subtle text-gh-success-fg dark:text-gh-dark-success-fg border border-gh-success-fg/20',
  medium: 'bg-gh-attention-subtle dark:bg-gh-dark-attention-subtle text-gh-attention-fg dark:text-gh-dark-attention-fg border border-gh-attention-fg/20',
  high: 'bg-gh-danger-subtle dark:bg-gh-dark-danger-subtle text-gh-danger-fg dark:text-gh-dark-danger-fg border border-gh-danger-fg/20',
};

export function TaskCard({ task, dragHandleProps }: TaskCardProps) {
  const { projects, tags } = useProjectStore();
  const { tasks, deleteTask } = useTaskStore();
  const [showEdit, setShowEdit] = useState(false);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [subtasksExpanded, setSubtasksExpanded] = useState(true);

  const project = projects.find((p) => p.id === task.projectId);
  const taskTags = tags.filter((t) => task.tagIds.includes(t.id));
  const urgency = task.urgency ?? 'medium';
  const urgencyClass = URGENCY_STYLES[urgency];

  // Get subtasks for this card
  const subtasks = tasks.filter((t) => t.parentTaskId === task.id);
  const doneSubtasks = subtasks.filter((t) => t.status === 'done').length;

  return (
    <>
      <div className="bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md border border-gh-border-default dark:border-gh-dark-border-default group hover:border-gh-accent-fg/50 dark:hover:border-gh-dark-accent-fg/50 transition-colors shadow-sm">
        {/* Drag handle + header */}
        <div
          className="flex items-start gap-2 p-3"
          {...(dragHandleProps ?? {})}
        >
          {/* Drag handle indicator */}
          <div className="mt-0.5 shrink-0 text-gh-fg-muted dark:text-gh-dark-fg-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10 4a1 1 0 100-2 1 1 0 000 2zM6 4a1 1 0 100-2 1 1 0 000 2zM10 8a1 1 0 100-2 1 1 0 000 2zM6 8a1 1 0 100-2 1 1 0 000 2zM10 12a1 1 0 100-2 1 1 0 000 2zM6 12a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gh-fg-default dark:text-gh-dark-fg-default leading-snug">{task.title}</p>
            {task.description && (
              <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted mt-0.5 line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setShowEdit(true)}
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

        {/* Meta (project, tags, urgency) */}
        <div className="px-3 pb-2 flex flex-wrap items-center gap-1">
          {project && <ProjectPill project={project} />}
          {taskTags.map((t) => <TagPill key={t.id} tag={t} />)}
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${urgencyClass}`}>
            {urgency === 'high' && (
              <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zM8 11a1 1 0 110 2 1 1 0 010-2z"/>
              </svg>
            )}
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </span>
        </div>

        {/* Subtasks section */}
        {subtasks.length > 0 && (
          <div className="border-t border-gh-border-default dark:border-gh-dark-border-default px-3 py-2">
            <button
              onClick={() => setSubtasksExpanded(!subtasksExpanded)}
              className="flex items-center gap-1 text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default w-full"
            >
              <svg
                className={`w-3 h-3 transition-transform ${subtasksExpanded ? 'rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{doneSubtasks}/{subtasks.length} subtasks</span>
              {/* Progress bar */}
              <div className="flex-1 ml-1 h-1 bg-gh-border-default dark:bg-gh-dark-border-default rounded-full overflow-hidden">
                <div
                  className="h-full bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis rounded-full transition-all"
                  style={{ width: subtasks.length > 0 ? `${(doneSubtasks / subtasks.length) * 100}%` : '0%' }}
                />
              </div>
            </button>
            {subtasksExpanded && (
              <div className="mt-1.5 space-y-0.5 pl-1">
                {subtasks.map((subtask) => (
                  <SubtaskRow key={subtask.id} subtask={subtask} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add subtask button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setShowAddSubtask(true)}
            className="flex items-center gap-1 text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-accent-fg dark:hover:text-gh-dark-accent-fg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add subtask
          </button>
        </div>
      </div>
      {showEdit && <TaskModal task={task} onClose={() => setShowEdit(false)} />}
      {showAddSubtask && (
        <TaskModal
          defaultStatus={task.status}
          parentTaskId={task.id}
          onClose={() => { setShowAddSubtask(false); setSubtasksExpanded(true); }}
        />
      )}
    </>
  );
}

interface SubtaskRowProps {
  subtask: Task;
}

function SubtaskRow({ subtask }: SubtaskRowProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const [showEdit, setShowEdit] = useState(false);
  const isDone = subtask.status === 'done';

  return (
    <>
      <div className="flex items-center gap-2 group/sub py-0.5 rounded hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default px-1">
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
        <span className={`flex-1 text-xs min-w-0 truncate ${isDone ? 'line-through text-gh-fg-muted dark:text-gh-dark-fg-muted' : 'text-gh-fg-default dark:text-gh-dark-fg-default'}`}>
          {subtask.title}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover/sub:opacity-100 shrink-0">
          <button
            onClick={() => setShowEdit(true)}
            className="p-0.5 rounded text-gh-fg-muted dark:text-gh-dark-fg-muted hover:bg-gh-canvas-default dark:hover:bg-gh-dark-canvas-subtle"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => deleteTask(subtask.id)}
            className="p-0.5 rounded text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-danger-fg dark:hover:text-gh-dark-danger-fg hover:bg-gh-danger-subtle dark:hover:bg-gh-dark-danger-subtle"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {showEdit && <TaskModal task={subtask} onClose={() => setShowEdit(false)} />}
    </>
  );
}
