import { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nanoid } from 'nanoid';
import { useSpaceStore } from '../../store/spaceStore';
import type { SpaceCard, SpaceConnection } from '../../types';
import { SpaceCardNode } from './SpaceCardNode';
import { SpaceEdge } from './SpaceEdge';

const GRID_SIZE = 20;
const snapToGrid = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

const nodeTypes = { spaceCard: SpaceCardNode };
const edgeTypes = { spaceEdge: SpaceEdge };

const edgeStyle = {
  stroke: '#6366f1',
  strokeDasharray: '6 3',
};
const edgeMarkerEnd = { type: MarkerType.ArrowClosed, color: '#6366f1' };

function cardToNode(card: SpaceCard): Node {
  return {
    id: card.id,
    type: 'spaceCard',
    position: { x: card.x, y: card.y },
    data: { content: card.content, projectId: card.projectId },
    style: { width: card.width, height: card.height },
  };
}

function connectionToEdge(conn: SpaceConnection): Edge {
  return {
    id: conn.id,
    source: conn.fromCardId,
    target: conn.toCardId,
    type: 'spaceEdge',
    style: edgeStyle,
    markerEnd: edgeMarkerEnd,
  };
}

function SpaceFlow() {
  const { cards, connections, addCard, updateCard, deleteCard, addConnection, deleteConnection } =
    useSpaceStore();
  const { screenToFlowPosition } = useReactFlow();

  // Nodes and edges are initialized from the persisted store on mount.
  // All subsequent mutations (add, move, resize, delete, connect) are
  // handled through React Flow callbacks that keep both RF state and the
  // Zustand store in sync, so no further store→RF sync is needed.
  const [nodes, setNodes] = useNodesState(cards.map(cardToNode));
  const [edges, setEdges] = useEdgesState(connections.map(connectionToEdge));

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      changes.forEach((change) => {
        if (change.type === 'position' && !change.dragging && change.position) {
          updateCard(change.id, {
            x: snapToGrid(change.position.x),
            y: snapToGrid(change.position.y),
          });
        }
        if (change.type === 'remove') {
          deleteCard(change.id);
        }
      });
    },
    [setNodes, updateCard, deleteCard]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      changes.forEach((change) => {
        if (change.type === 'remove') {
          deleteConnection(change.id);
        }
      });
    },
    [setEdges, deleteConnection]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const id = nanoid();
      addConnection(connection.source, connection.target);
      setEdges((eds) =>
        addEdge(
          { ...connection, id, type: 'spaceEdge', style: edgeStyle, markerEnd: edgeMarkerEnd },
          eds
        )
      );
    },
    [addConnection, setEdges]
  );

  const createCard = useCallback(
    (x: number, y: number) => {
      const id = nanoid();
      const newCard: SpaceCard = {
        id,
        content: '',
        x: snapToGrid(x),
        y: snapToGrid(y),
        width: 200,
        height: 160,
        createdAt: new Date().toISOString(),
      };
      addCard(newCard);
      setNodes((nds) => [...nds, cardToNode(newCard)]);
    },
    [addCard, setNodes]
  );

  const handleAddCard = useCallback(() => createCard(80, 80), [createCard]);

  const handleContainerDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as Element;
      if (
        target.closest('.react-flow__node') ||
        target.closest('.react-flow__edge') ||
        target.closest('.react-flow__controls')
      )
        return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      createCard(pos.x, pos.y);
    },
    [screenToFlowPosition, createCard]
  );

  const colorMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <div className="relative h-full" onDoubleClick={handleContainerDoubleClick}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={handleAddCard}
          className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 shadow-sm"
        >
          + Add Card
        </button>
        <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-xs border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
          Drag handle to connect · Double-click to add
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        deleteKeyCode={['Backspace', 'Delete']}
        colorMode={colorMode}
        fitView={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={3}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export function SpaceTab() {
  return (
    <ReactFlowProvider>
      <SpaceFlow />
    </ReactFlowProvider>
  );
}

