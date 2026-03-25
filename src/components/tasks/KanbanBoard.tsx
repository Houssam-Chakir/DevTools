import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../../store/taskStore';
import { KanbanColumn } from './KanbanColumn';
import type { TaskStatus } from '../../types';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in-progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

interface KanbanBoardProps {
  search: string;
  filterProjectId: string;
  filterTagId: string;
}

export function KanbanBoard({ search, filterProjectId, filterTagId }: KanbanBoardProps) {
  const { tasks, moveTask } = useTaskStore();

  const filteredTasks = tasks.filter((t) => {
    if (t.parentTaskId) return false; // subtasks are shown inside parent cards
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProjectId && t.projectId !== filterProjectId) return false;
    if (filterTagId && !t.tagIds.includes(filterTagId)) return false;
    return true;
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as TaskStatus;
    moveTask(result.draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full overflow-x-auto p-4 bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default">
        <div className="flex gap-4 h-full">
          {COLUMNS.map(({ status, label }) => (
            <KanbanColumn
              key={status}
              status={status}
              label={label}
              tasks={filteredTasks.filter((t) => t.status === status)}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
