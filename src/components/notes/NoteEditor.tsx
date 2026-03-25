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
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="flex-1 text-lg font-semibold bg-transparent outline-none"
          placeholder="Note title..."
        />
        <select
          value={note.projectId ?? ''}
          onChange={handleProjectChange}
          className="px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        >
          <option value="">No project</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
          title="Delete note"
        >
          🗑
        </button>
      </div>
      {/* Formatting toolbar */}
      <div className="flex items-center gap-1 px-6 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex-wrap">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="H1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="B" bold />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="I" italic />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="• List" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="1. List" />
        <div className="flex flex-wrap gap-1 ml-4">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={`px-2 py-0.5 rounded-full text-xs border ${
                note.tagIds.includes(t.id)
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
              }`}
            >
              #{t.name}
            </button>
          ))}
        </div>
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
      className={`px-2.5 py-1 rounded text-xs transition-colors ${
        active
          ? 'bg-indigo-500 text-white'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
      }`}
      style={{ fontWeight: isBold ? 700 : undefined, fontStyle: isItalic ? 'italic' : undefined }}
    >
      {label}
    </button>
  );
}
