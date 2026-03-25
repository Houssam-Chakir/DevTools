import type { Tag } from '../../types';

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
}

export function TagPill({ tag, onRemove }: TagPillProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
      #{tag.name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-75">✕</button>
      )}
    </span>
  );
}
