import { useState, useRef } from 'react';
import type { SpaceCard as SpaceCardType } from '../../types';
import { useSpaceStore } from '../../store/spaceStore';
import { useProjectStore } from '../../store/projectStore';
import { ProjectPill } from '../shared/ProjectPill';

interface SpaceCardProps {
  card: SpaceCardType;
  scale: number;
  onStartConnection: (cardId: string) => void;
  connectingFrom: string | null;
}

export function SpaceCard({ card, scale, onStartConnection, connectingFrom }: SpaceCardProps) {
  const { updateCard, deleteCard } = useSpaceStore();
  const { projects } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.content);
  const dragStart = useRef<{ mouseX: number; mouseY: number; cardX: number; cardY: number } | null>(null);
  const resizeStart = useRef<{ mouseX: number; mouseY: number; w: number; h: number } | null>(null);

  const project = projects.find((p) => p.id === card.projectId);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, cardX: card.x, cardY: card.y };
    const handleMove = (me: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = (me.clientX - dragStart.current.mouseX) / scale;
      const dy = (me.clientY - dragStart.current.mouseY) / scale;
      updateCard(card.id, { x: dragStart.current.cardX + dx, y: dragStart.current.cardY + dy });
    };
    const handleUp = () => {
      dragStart.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, w: card.width, h: card.height };
    const handleMove = (me: MouseEvent) => {
      if (!resizeStart.current) return;
      const dx = (me.clientX - resizeStart.current.mouseX) / scale;
      const dy = (me.clientY - resizeStart.current.mouseY) / scale;
      updateCard(card.id, {
        width: Math.max(120, resizeStart.current.w + dx),
        height: Math.max(80, resizeStart.current.h + dy),
      });
    };
    const handleUp = () => {
      resizeStart.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleSaveContent = () => {
    updateCard(card.id, { content });
    setIsEditing(false);
  };

  const isConnectTarget = connectingFrom && connectingFrom !== card.id;

  return (
    <foreignObject
      x={card.x}
      y={card.y}
      width={card.width}
      height={card.height}
      style={{ overflow: 'visible' }}
    >
      <div
        className={`w-full h-full bg-white dark:bg-gray-800 rounded-xl border shadow-sm flex flex-col overflow-hidden group relative ${
          isConnectTarget
            ? 'border-indigo-500 cursor-pointer ring-2 ring-indigo-400'
            : 'border-gray-200 dark:border-gray-700'
        }`}
        style={{ width: card.width, height: card.height }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsEditing(true)}
        onClick={() => {
          if (isConnectTarget) onStartConnection(card.id);
        }}
      >
        <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
          {project && <ProjectPill project={project} />}
          <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onStartConnection(card.id); }}
              className="w-5 h-5 flex items-center justify-center rounded text-xs text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              title="Connect"
            >
              ⟶
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
              className="w-5 h-5 flex items-center justify-center rounded text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 p-2 overflow-hidden">
          {isEditing ? (
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSaveContent}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full h-full resize-none text-xs bg-transparent outline-none"
            />
          ) : (
            <p className="text-xs whitespace-pre-wrap break-words">{card.content || 'Double-click to edit'}</p>
          )}
        </div>
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(135deg, transparent 50%, #6366f1 50%)' }}
        />
      </div>
    </foreignObject>
  );
}
