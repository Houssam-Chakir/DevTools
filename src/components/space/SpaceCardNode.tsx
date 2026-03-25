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
      className={`w-full h-full bg-white dark:bg-gray-800 rounded-xl border shadow-sm flex flex-col overflow-hidden group relative ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-400'
          : 'border-gray-200 dark:border-gray-700'
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
        className="!w-2.5 !h-2.5 !border-indigo-400 !bg-white dark:!bg-gray-800"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !border-indigo-400 !bg-white dark:!bg-gray-800"
      />

      {/* Header */}
      <div className="nodrag flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
        {project && <ProjectPill project={project} />}
        <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100">
          <button
            onClick={handleDelete}
            className="w-5 h-5 flex items-center justify-center rounded text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            ✕
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
            className="w-full h-full resize-none text-xs bg-transparent outline-none"
          />
        ) : (
          <p className="text-xs whitespace-pre-wrap break-words">
            {(data as SpaceCardData).content || 'Double-click to edit'}
          </p>
        )}
      </div>
    </div>
  );
}
