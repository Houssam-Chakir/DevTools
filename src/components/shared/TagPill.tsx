import type { Tag } from '../../types';

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
}

export function TagPill({ tag, onRemove }: TagPillProps) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset text-gh-fg-muted dark:text-gh-dark-fg-muted border border-gh-border-default dark:border-gh-dark-border-default">
      #{tag.name}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-75">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
