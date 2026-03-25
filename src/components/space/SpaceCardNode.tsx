import { useState, useCallback } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import type { NodeProps, ResizeDragEvent, ResizeParams } from '@xyflow/react';
import { useSpaceStore } from '../../store/spaceStore';
import { useProjectStore } from '../../store/projectStore';
import { ProjectPill } from '../shared/ProjectPill';

export interface SpaceCardData extends Record<string, unknown> {
  content: string;
  projectId?: string;
}

export function SpaceCardNode({ id, data, selected }: NodeProps) {
  const { updateCard } = useSpaceStore();
  const { projects } = useProjectStore();
  const { deleteElements, updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState((data as SpaceCardData).content ?? '');

  const project = projects.find((p) => p.id === (data as SpaceCardData).projectId);

  const handleSave = useCallback(() => {
    updateCard(id, { content: draft });
    updateNodeData(id, { content: draft });
    setIsEditing(false);
  }, [id, draft, updateCard, updateNodeData]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteElements({ nodes: [{ id }] });
    },
    [id, deleteElements]
  );

  const handleResizeEnd = useCallback(
    (_event: ResizeDragEvent, params: ResizeParams) => {
      updateCard(id, {
        x: Math.round(params.x),
        y: Math.round(params.y),
        width: Math.round(params.width),
        height: Math.round(params.height),
      });
    },
    [id, updateCard]
  );

  return (
    <div
      className={`w-full h-full bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md border shadow-sm flex flex-col overflow-hidden group relative ${
        selected
          ? 'border-gh-accent-fg dark:border-gh-dark-accent-fg ring-2 ring-gh-accent-fg/30 dark:ring-gh-dark-accent-fg/30'
          : 'border-gh-border-default dark:border-gh-dark-border-default hover:border-gh-accent-fg/50 dark:hover:border-gh-dark-accent-fg/50'
      }`}
    >
      <NodeResizer
        minWidth={120}
        minHeight={80}
        isVisible={selected}
        onResizeEnd={handleResizeEnd}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !border-gh-accent-fg !bg-gh-canvas-default dark:!bg-gh-dark-canvas-subtle"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !border-gh-accent-fg !bg-gh-canvas-default dark:!bg-gh-dark-canvas-subtle"
      />

      {/* Header */}
      <div className="nodrag flex items-center justify-between px-2 py-1 border-b border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset shrink-0">
        {project && <ProjectPill project={project} />}
        <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100">
          <button
            onClick={handleDelete}
            className="w-5 h-5 flex items-center justify-center rounded text-gh-danger-fg dark:text-gh-dark-danger-fg hover:bg-gh-danger-subtle dark:hover:bg-gh-dark-danger-subtle"
            title="Delete"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className="nodrag flex-1 p-2 overflow-hidden"
        onDoubleClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft((data as SpaceCardData).content ?? '');
                setIsEditing(false);
              }
            }}
            className="w-full h-full resize-none text-xs bg-transparent outline-none text-gh-fg-default dark:text-gh-dark-fg-default"
          />
        ) : (
          <p className="text-xs whitespace-pre-wrap break-words text-gh-fg-default dark:text-gh-dark-fg-default">
            {(data as SpaceCardData).content || (
              <span className="text-gh-fg-muted dark:text-gh-dark-fg-muted italic">Double-click to edit</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
