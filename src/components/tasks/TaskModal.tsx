import { useState } from 'react';
import type { Task, TaskStatus, TaskUrgency } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';

interface TaskModalProps {
  task?: Task;
  defaultStatus?: TaskStatus;
  onClose: () => void;
}

export function TaskModal({ task, defaultStatus = 'todo', onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const { projects, tags } = useProjectStore();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [urgency, setUrgency] = useState<TaskUrgency>(task?.urgency ?? 'medium');
  const [projectId, setProjectId] = useState(task?.projectId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(task?.tagIds ?? []);

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
      });
    }
    onClose();
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            placeholder="Task title..."
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            placeholder="Optional description..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ] as { value: TaskStatus; label: string }[]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  status === option.value
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urgency</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'low', label: 'Low', activeClass: 'bg-emerald-500 border-emerald-500' },
              { value: 'medium', label: 'Medium', activeClass: 'bg-amber-500 border-amber-500' },
              { value: 'high', label: 'High', activeClass: 'bg-rose-500 border-rose-500' },
            ] as { value: TaskUrgency; label: string; activeClass: string }[]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUrgency(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  urgency === option.value
                    ? `${option.activeClass} text-white`
                    : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProjectId('')}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                !projectId
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              No project
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProjectId(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  projectId === p.id
                    ? 'text-white border-transparent'
                    : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={projectId === p.id ? { backgroundColor: p.color } : undefined}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={`px-2 py-0.5 rounded-full text-xs border ${
                    tagIds.includes(t.id)
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
