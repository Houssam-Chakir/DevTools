import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from './Modal';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6'];

interface ProjectManagerProps {
  onClose: () => void;
}

export function ProjectManager({ onClose }: ProjectManagerProps) {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProject(newName.trim(), newColor);
    setNewName('');
    setNewColor(COLORS[0]);
  };

  const handleEdit = (id: string) => {
    if (!editName.trim()) return;
    updateProject(id, { name: editName.trim() });
    setEditId(null);
  };

  const inputClass = "flex-1 px-3 py-1.5 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-default dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg";

  return (
    <Modal title="Manage Projects" onClose={onClose}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Project name..."
            className={inputClass}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-1 items-center">
            {COLORS.map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${newColor === c ? 'border-gh-fg-default dark:border-gh-dark-fg-default scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white rounded-md text-sm hover:opacity-90 font-medium shrink-0"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1.5 divide-y divide-gh-border-default dark:divide-gh-dark-border-default border border-gh-border-default dark:border-gh-dark-border-default rounded-md overflow-hidden">
          {projects.length === 0 && (
            <li className="px-3 py-3 text-sm text-gh-fg-muted dark:text-gh-dark-fg-muted text-center">No projects yet</li>
          )}
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-2 px-3 py-2 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              {editId === p.id ? (
                <>
                  <input
                    className={inputClass}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(p.id)}
                    autoFocus
                  />
                  <button onClick={() => handleEdit(p.id)} className="text-xs text-gh-success-fg dark:text-gh-dark-success-fg font-medium">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gh-fg-default dark:text-gh-dark-fg-default">{p.name}</span>
                  <button onClick={() => { setEditId(p.id); setEditName(p.name); }} className="text-xs text-gh-accent-fg dark:text-gh-dark-accent-fg">Edit</button>
                  <button onClick={() => deleteProject(p.id)} className="text-xs text-gh-danger-fg dark:text-gh-dark-danger-fg">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
