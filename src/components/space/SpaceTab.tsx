import { useRef, useState, useCallback } from 'react';
import { useSpaceStore } from '../../store/spaceStore';
import { SpaceCard } from './SpaceCard';
import { ConnectionLine } from './ConnectionLine';

export function SpaceTab() {
  const { cards, connections, addCard, addConnection } = useSpaceStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const panStart = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number } | null>(null);

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current && (e.target as Element).tagName !== 'rect') return;
    panStart.current = { mouseX: e.clientX, mouseY: e.clientY, panX: pan.x, panY: pan.y };
    const handleMove = (me: MouseEvent) => {
      if (!panStart.current) return;
      setPan({
        x: panStart.current.panX + me.clientX - panStart.current.mouseX,
        y: panStart.current.panY + me.clientY - panStart.current.mouseY,
      });
    };
    const handleUp = () => {
      panStart.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(3, Math.max(0.2, s - e.deltaY * 0.001)));
  };

  const handleDblClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current && (e.target as Element).tagName !== 'rect') return;
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;
    addCard({ content: '', x, y, width: 200, height: 150 });
  };

  const handleStartConnection = useCallback((cardId: string) => {
    if (!connectingFrom) {
      setConnectingFrom(cardId);
    } else if (connectingFrom !== cardId) {
      addConnection(connectingFrom, cardId);
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  }, [connectingFrom, addConnection]);

  const handleAddCard = () => {
    addCard({ content: '', x: (300 - pan.x) / scale, y: (200 - pan.y) / scale, width: 200, height: 150 });
  };

  return (
    <div className="relative h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={handleAddCard}
          className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 shadow-sm"
        >
          + Add Card
        </button>
        <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700 shadow-sm">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={() => { setPan({ x: 0, y: 0 }); setScale(1); }}
          className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
        >
          Reset View
        </button>
        {connectingFrom && (
          <div className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm border border-indigo-300 dark:border-indigo-600">
            Click another card to connect · <button onClick={() => setConnectingFrom(null)} className="underline">Cancel</button>
          </div>
        )}
      </div>
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleSvgMouseDown}
        onWheel={handleWheel}
        onDoubleClick={handleDblClick}
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x % 20} ${pan.y % 20})`}>
            <circle cx="1" cy="1" r="1" fill="#d1d5db" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}>
          <svg overflow="visible">
            {connections.map((conn) => (
              <ConnectionLine key={conn.id} connection={conn} cards={cards} />
            ))}
            {cards.map((card) => (
              <SpaceCard
                key={card.id}
                card={card}
                scale={scale}
                onStartConnection={handleStartConnection}
                connectingFrom={connectingFrom}
              />
            ))}
          </svg>
        </g>
      </svg>
    </div>
  );
}
