import { useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, useReactFlow } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export function SpaceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteElements({ edges: [{ id }] });
    },
    [id, deleteElements]
  );

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <button
            onClick={handleDelete}
            className="w-5 h-5 rounded-full bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle border border-gh-accent-fg dark:border-gh-dark-accent-fg text-gh-accent-fg dark:text-gh-dark-accent-fg text-xs flex items-center justify-center hover:bg-gh-accent-subtle dark:hover:bg-gh-dark-accent-subtle shadow-sm"
            title="Delete connection"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
