import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from './Modal';

interface TagManagerProps {
  onClose: () => void;
}

export function TagManager({ onClose }: TagManagerProps) {
  const { tags, addTag, updateTag, deleteTag } = useProjectStore();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTag(newName.trim());
    setNewName('');
  };

  const handleEdit = (id: string) => {
    if (!editName.trim()) return;
    updateTag(id, editName.trim());
    setEditId(null);
  };

  const inputClass = "flex-1 px-3 py-1.5 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-default dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg";

  return (
    <Modal title="Manage Labels" onClose={onClose}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Label name..."
            className={inputClass}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white rounded-md text-sm hover:opacity-90 font-medium"
          >
            Add
          </button>
        </div>
        <ul className="space-y-0 divide-y divide-gh-border-default dark:divide-gh-dark-border-default border border-gh-border-default dark:border-gh-dark-border-default rounded-md overflow-hidden">
          {tags.length === 0 && (
            <li className="px-3 py-3 text-sm text-gh-fg-muted dark:text-gh-dark-fg-muted text-center">No labels yet</li>
          )}
          {tags.map((t) => (
            <li key={t.id} className="flex items-center gap-2 px-3 py-2 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default">
              {editId === t.id ? (
                <>
                  <input
                    className={inputClass}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(t.id)}
                    autoFocus
                  />
                  <button onClick={() => handleEdit(t.id)} className="text-xs text-gh-success-fg dark:text-gh-dark-success-fg font-medium">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted">Cancel</button>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset border border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-muted dark:text-gh-dark-fg-muted">
                    #{t.name}
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => { setEditId(t.id); setEditName(t.name); }} className="text-xs text-gh-accent-fg dark:text-gh-dark-accent-fg">Edit</button>
                    <button onClick={() => deleteTag(t.id)} className="text-xs text-gh-danger-fg dark:text-gh-dark-danger-fg">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
