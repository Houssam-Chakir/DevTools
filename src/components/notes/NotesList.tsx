import { useNoteStore } from '../../store/noteStore';
import { NoteCard } from './NoteCard';
import type { Note } from '../../types';

interface NotesListProps {
  activeNoteId: string | null;
  onSelect: (note: Note) => void;
  onNew: () => void;
}

export function NotesList({ activeNoteId, onSelect, onNew }: NotesListProps) {
  const { notes } = useNoteStore();

  return (
    <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Notes</h2>
        <button
          onClick={onNew}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white text-sm hover:bg-indigo-600"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            No notes yet. Create one!
          </p>
        )}
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isActive={note.id === activeNoteId}
            onClick={() => onSelect(note)}
          />
        ))}
      </div>
    </div>
  );
}
