import type { Project } from '../../types';

interface ProjectPillProps {
  project: Project;
  onRemove?: () => void;
}

export function ProjectPill({ project, onRemove }: ProjectPillProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: project.color }}
    >
      {project.name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-75">✕</button>
      )}
    </span>
  );
}
