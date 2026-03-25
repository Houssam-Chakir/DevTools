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
            className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-indigo-500 text-indigo-500 text-xs flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-sm"
            title="Delete connection"
          >
            ✕
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
