import type { Note } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { ProjectPill } from '../shared/ProjectPill';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isActive, onClick }: NoteCardProps) {
  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === note.projectId);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
      }`}
    >
      <p className="text-sm font-medium truncate">{note.title || 'Untitled Note'}</p>
      {project && (
        <div className="mt-1">
          <ProjectPill project={project} />
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </button>
  );
}
