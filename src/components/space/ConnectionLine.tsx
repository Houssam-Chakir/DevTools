import type { SpaceCard, SpaceConnection } from '../../types';
import { useSpaceStore } from '../../store/spaceStore';

interface ConnectionLineProps {
  connection: SpaceConnection;
  cards: SpaceCard[];
}

export function ConnectionLine({ connection, cards }: ConnectionLineProps) {
  const { deleteConnection } = useSpaceStore();
  const fromCard = cards.find((c) => c.id === connection.fromCardId);
  const toCard = cards.find((c) => c.id === connection.toCardId);

  if (!fromCard || !toCard) return null;

  const x1 = fromCard.x + fromCard.width / 2;
  const y1 = fromCard.y + fromCard.height / 2;
  const x2 = toCard.x + toCard.width / 2;
  const y2 = toCard.y + toCard.height / 2;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#6366f1"
        strokeWidth={2}
        strokeDasharray="6 3"
        markerEnd="url(#arrow)"
      />
      <circle
        cx={midX} cy={midY} r={8}
        fill="white"
        stroke="#6366f1"
        strokeWidth={1.5}
        className="cursor-pointer"
        onClick={() => deleteConnection(connection.id)}
      />
      <text
        x={midX} y={midY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fill="#6366f1"
        className="cursor-pointer select-none"
        onClick={() => deleteConnection(connection.id)}
      >
        ✕
      </text>
    </g>
  );
}
