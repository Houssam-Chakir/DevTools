import { useState } from 'react';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { useNoteStore } from '../../store/noteStore';
import { useSpaceStore } from '../../store/spaceStore';
import type { Note } from '../../types';

export function NotesTab() {
  const { notes, addNote, deleteNote } = useNoteStore();
  const { cleanupNoteRef } = useSpaceStore();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes[0]?.id ?? null
  );

  const handleNew = () => {
    const before = useNoteStore.getState().notes;
    addNote({ title: 'New Note', content: '', tagIds: [] });
    const after = useNoteStore.getState().notes;
    const newNote = after.find((n) => !before.find((b) => b.id === n.id));
    if (newNote) setActiveNoteId(newNote.id);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    cleanupNoteRef(id);
    const remaining = notes.filter((n) => n.id !== id);
    setActiveNoteId(remaining[0]?.id ?? null);
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="h-full flex">
      <div className="w-64 shrink-0 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle flex flex-col overflow-hidden">
        <NotesList
          activeNoteId={activeNoteId}
          onSelect={(note: Note) => setActiveNoteId(note.id)}
          onNew={handleNew}
        />
      </div>
      <div className="flex-1 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle overflow-hidden flex flex-col border-l border-gh-border-default dark:border-gh-dark-border-default">
        {activeNote ? (
          <NoteEditor note={activeNote} onDelete={() => handleDelete(activeNote.id)} />
        ) : (
          <div className="flex items-center justify-center h-full text-gh-fg-muted dark:text-gh-dark-fg-muted bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-sm">Select a note or create a new one</p>
              <button
                onClick={handleNew}
                className="mt-4 px-4 py-1.5 bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white rounded-md text-sm hover:opacity-90 font-medium"
              >
                Create Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
