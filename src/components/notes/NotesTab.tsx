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
      <div className="w-64 shrink-0 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        <NotesList
          activeNoteId={activeNoteId}
          onSelect={(note: Note) => setActiveNoteId(note.id)}
          onNew={handleNew}
        />
      </div>
      <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
        {activeNote ? (
          <NoteEditor note={activeNote} onDelete={() => handleDelete(activeNote.id)} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-sm">Select a note or create a new one</p>
              <button
                onClick={handleNew}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
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
