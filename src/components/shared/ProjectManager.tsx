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

  return (
    <Modal title="Manage Projects" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Project name..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                onClick={() => setNewColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${newColor === c ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
              {editId === p.id ? (
                <>
                  <input
                    className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(p.id)}
                  />
                  <button onClick={() => handleEdit(p.id)} className="text-xs text-green-600">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-gray-500">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{p.name}</span>
                  <button onClick={() => { setEditId(p.id); setEditName(p.name); }} className="text-xs text-indigo-500">Edit</button>
                  <button onClick={() => deleteProject(p.id)} className="text-xs text-red-500">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
