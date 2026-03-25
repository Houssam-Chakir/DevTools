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

export function KanbanColumn({ status, label, tasks }: KanbanColumnProps) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 min-w-[280px] w-80 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white text-sm hover:bg-indigo-600"
        >
          +
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-2 min-h-[60px] rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
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
