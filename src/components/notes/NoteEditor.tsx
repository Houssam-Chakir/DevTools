import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Note } from '../../types';
import { useNoteStore } from '../../store/noteStore';
import { useProjectStore } from '../../store/projectStore';

interface NoteEditorProps {
  note: Note;
  onDelete: () => void;
}

export function NoteEditor({ note, onDelete }: NoteEditorProps) {
  const { updateNote } = useNoteStore();
  const { projects, tags } = useProjectStore();
  const [title, setTitle] = useState(note.title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate: ({ editor }) => {
      updateNote(note.id, { content: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== note.content) {
      editor.commands.setContent(note.content);
    }
    setTitle(note.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  const handleTitleBlur = () => {
    updateNote(note.id, { title: title.trim() || 'Untitled Note' });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNote(note.id, { projectId: e.target.value || undefined });
  };

  const toggleTag = (tagId: string) => {
    const newTagIds = note.tagIds.includes(tagId)
      ? note.tagIds.filter((id) => id !== tagId)
      : [...note.tagIds, tagId];
    updateNote(note.id, { tagIds: newTagIds });
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gh-border-default dark:border-gh-dark-border-default">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="flex-1 text-base font-semibold bg-transparent outline-none text-gh-fg-default dark:text-gh-dark-fg-default placeholder-gh-fg-muted dark:placeholder-gh-dark-fg-muted"
          placeholder="Note title..."
        />
        <select
          value={note.projectId ?? ''}
          onChange={handleProjectChange}
          className="px-2 py-1 text-xs rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default focus:outline-none"
        >
          <option value="">No project</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-gh-danger-fg dark:text-gh-dark-danger-fg hover:bg-gh-danger-subtle dark:hover:bg-gh-dark-danger-subtle"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {/* Formatting toolbar */}
      <div className="flex items-center gap-1 px-4 py-1.5 bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset border-b border-gh-border-default dark:border-gh-dark-border-default flex-wrap">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="H1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" />
        <div className="w-px h-4 bg-gh-border-default dark:bg-gh-dark-border-default mx-0.5" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="B" bold />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="I" italic />
        <div className="w-px h-4 bg-gh-border-default dark:bg-gh-dark-border-default mx-0.5" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="• List" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="1. List" />
        {tags.length > 0 && (
          <>
            <div className="w-px h-4 bg-gh-border-default dark:bg-gh-dark-border-default mx-0.5" />
            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={`px-1.5 py-0.5 rounded-full text-xs border transition-colors ${
                    note.tagIds.includes(t.id)
                      ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                      : 'bg-transparent text-gh-fg-muted dark:text-gh-dark-fg-muted border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
                  }`}
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}

interface ToolbarBtnProps {
  onClick: () => void;
  active: boolean;
  label: string;
  bold?: boolean;
  italic?: boolean;
}

function ToolbarBtn({ onClick, active, label, bold: isBold, italic: isItalic }: ToolbarBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-xs transition-colors ${
        active
          ? 'bg-gh-accent-emphasis text-white'
          : 'bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default border border-gh-border-default dark:border-gh-dark-border-default'
      }`}
      style={{ fontWeight: isBold ? 700 : undefined, fontStyle: isItalic ? 'italic' : undefined }}
    >
      {label}
    </button>
  );
}
