import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
}

const STATUS_COLORS: Record<TaskStatus, { dot: string; badge: string }> = {
  'todo': {
    dot: 'bg-gh-fg-muted dark:bg-gh-dark-fg-muted',
    badge: 'bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset text-gh-fg-muted dark:text-gh-dark-fg-muted border border-gh-border-default dark:border-gh-dark-border-default',
  },
  'in-progress': {
    dot: 'bg-gh-accent-fg dark:bg-gh-dark-accent-fg',
    badge: 'bg-gh-accent-subtle dark:bg-gh-dark-accent-subtle text-gh-accent-fg dark:text-gh-dark-accent-fg border border-gh-accent-fg/30 dark:border-gh-dark-accent-fg/30',
  },
  'done': {
    dot: 'bg-gh-done-fg dark:bg-gh-dark-done-fg',
    badge: 'bg-gh-done-subtle dark:bg-gh-dark-done-subtle text-gh-done-fg dark:text-gh-dark-done-fg border border-gh-done-fg/30 dark:border-gh-dark-done-fg/30',
  },
};

export function KanbanColumn({ status, label, tasks }: KanbanColumnProps) {
  const [showAdd, setShowAdd] = useState(false);
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex flex-col bg-gh-canvas-subtle dark:bg-gh-dark-canvas-subtle rounded-md min-w-[280px] w-72 shrink-0 border border-gh-border-default dark:border-gh-dark-border-default">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gh-border-default dark:border-gh-dark-border-default">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
          <h3 className="text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default uppercase tracking-wide">
            {label}
          </h3>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gh-fg-muted dark:text-gh-dark-fg-muted hover:bg-gh-canvas-default dark:hover:bg-gh-dark-canvas-default hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default transition-colors"
          title="Add item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-2 p-2 min-h-[60px] rounded-b-md transition-colors ${
              snapshot.isDraggingOver ? 'bg-gh-accent-subtle/50 dark:bg-gh-dark-accent-subtle/50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <TaskCard task={task} dragHandleProps={provided.dragHandleProps} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {showAdd && <TaskModal defaultStatus={status} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
