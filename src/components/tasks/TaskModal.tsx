import { useState } from 'react';
import type { Task, TaskStatus, TaskUrgency } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';

interface TaskModalProps {
  task?: Task;
  defaultStatus?: TaskStatus;
  parentTaskId?: string;
  onClose: () => void;
}

export function TaskModal({ task, defaultStatus = 'todo', parentTaskId, onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const { projects, tags } = useProjectStore();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [urgency, setUrgency] = useState<TaskUrgency>(task?.urgency ?? 'medium');
  const [projectId, setProjectId] = useState(task?.projectId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(task?.tagIds ?? []);

  const modalTitle = parentTaskId
    ? 'Add Subtask'
    : task
    ? 'Edit Task'
    : 'New Task';

  const handleSave = () => {
    if (!title.trim()) return;
    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        urgency,
        projectId: projectId || undefined,
        tagIds,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        urgency,
        projectId: projectId || undefined,
        tagIds,
        parentTaskId: parentTaskId || undefined,
      });
    }
    onClose();
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const inputClass = "w-full px-3 py-1.5 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-default dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg focus:ring-1 focus:ring-gh-accent-fg/30 dark:focus:ring-gh-dark-accent-fg/30";

  return (
    <Modal title={modalTitle} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder={parentTaskId ? 'Subtask title...' : 'Task title...'}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Optional description..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Status</label>
          <div className="flex flex-wrap gap-1.5">
            {([
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ] as { value: TaskStatus; label: string }[]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  status === option.value
                    ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                    : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Priority</label>
          <div className="flex flex-wrap gap-1.5">
            {([
              { value: 'low', label: 'Low', activeClass: 'bg-gh-success-emphasis border-gh-success-emphasis' },
              { value: 'medium', label: 'Medium', activeClass: 'bg-gh-attention-emphasis border-gh-attention-emphasis' },
              { value: 'high', label: 'High', activeClass: 'bg-gh-danger-emphasis border-gh-danger-emphasis' },
            ] as { value: TaskUrgency; label: string; activeClass: string }[]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUrgency(option.value)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  urgency === option.value
                    ? `${option.activeClass} text-white`
                    : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {!parentTaskId && (
          <div>
            <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Project</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setProjectId('')}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  !projectId
                    ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                    : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                }`}
              >
                No project
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProjectId(p.id)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    projectId === p.id
                      ? 'text-white border-transparent'
                      : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                  }`}
                  style={projectId === p.id ? { backgroundColor: p.color } : undefined}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {tags.length > 0 && !parentTaskId && (
          <div>
            <label className="block text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-1">Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                    tagIds.includes(t.id)
                      ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                      : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                  }`}
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-1 border-t border-gh-border-default dark:border-gh-dark-border-default">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm rounded-md bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white hover:opacity-90 font-medium"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
