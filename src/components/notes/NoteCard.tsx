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
      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-gh-accent-subtle dark:bg-gh-dark-accent-subtle border border-gh-accent-fg/30 dark:border-gh-dark-accent-fg/30'
          : 'hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default border border-transparent'
      }`}
    >
      <p className="text-sm font-medium truncate text-gh-fg-default dark:text-gh-dark-fg-default">
        {note.title || 'Untitled Note'}
      </p>
      {project && (
        <div className="mt-1">
          <ProjectPill project={project} />
        </div>
      )}
      <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted mt-1">
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </button>
  );
}
