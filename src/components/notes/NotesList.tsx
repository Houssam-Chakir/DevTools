import { useState } from 'react';
import { useNoteStore } from '../../store/noteStore';
import { useProjectStore } from '../../store/projectStore';
import { NoteCard } from './NoteCard';
import type { Note } from '../../types';

interface NotesListProps {
  activeNoteId: string | null;
  onSelect: (note: Note) => void;
  onNew: () => void;
}

export function NotesList({ activeNoteId, onSelect, onNew }: NotesListProps) {
  const { notes } = useNoteStore();
  const { projects } = useProjectStore();
  const [filterProjectId, setFilterProjectId] = useState('');

  const filteredNotes = filterProjectId
    ? notes.filter((n) => n.projectId === filterProjectId)
    : notes;

  return (
    <div className="flex flex-col h-full border-r border-gh-border-default dark:border-gh-dark-border-default">
      <div className="px-3 py-2.5 border-b border-gh-border-default dark:border-gh-dark-border-default flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default uppercase tracking-wide shrink-0">Notes</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white text-xs hover:opacity-90 font-medium shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>
      {projects.length > 0 && (
        <div className="px-2 py-1.5 border-b border-gh-border-default dark:border-gh-dark-border-default">
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="w-full px-2 py-1 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-xs focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {filteredNotes.length === 0 && (
          <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted text-center py-8 px-2">
            {filterProjectId ? 'No notes in this project' : 'No notes yet'}
          </p>
        )}
        {filteredNotes.map((note) => (
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

