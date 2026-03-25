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

  return (
    <Modal title="Manage Tags" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tag name..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tags.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              {editId === t.id ? (
                <>
                  <input
                    className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(t.id)}
                  />
                  <button onClick={() => handleEdit(t.id)} className="text-xs text-green-600">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-gray-500">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">#{t.name}</span>
                  <button onClick={() => { setEditId(t.id); setEditName(t.name); }} className="text-xs text-indigo-500">Edit</button>
                  <button onClick={() => deleteTag(t.id)} className="text-xs text-red-500">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
