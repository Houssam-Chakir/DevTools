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
    <div className="flex flex-col h-full border-r border-gh-border-default dark:border-gh-dark-border-default">
      <div className="px-3 py-2 border-b border-gh-border-default dark:border-gh-dark-border-default flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default uppercase tracking-wide">Notes</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white text-xs hover:opacity-90 font-medium"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {notes.length === 0 && (
          <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted text-center py-8">
            No notes yet
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
