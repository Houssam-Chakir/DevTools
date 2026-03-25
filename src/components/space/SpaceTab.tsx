import { useCallback, useState, useMemo } from 'react';
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
import { useProjectStore } from '../../store/projectStore';
import type { SpaceCard, SpaceConnection } from '../../types';
import { SpaceCardNode } from './SpaceCardNode';
import { SpaceEdge } from './SpaceEdge';

const GRID_SIZE = 20;
const snapToGrid = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

const nodeTypes = { spaceCard: SpaceCardNode };
const edgeTypes = { spaceEdge: SpaceEdge };

const edgeStyle = {
  stroke: '#0969da',
  strokeDasharray: '6 3',
};
const edgeMarkerEnd = { type: MarkerType.ArrowClosed, color: '#0969da' };

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

interface SpaceFlowProps {
  selectedProjectId: string;
}

function SpaceFlow({ selectedProjectId }: SpaceFlowProps) {
  const { cards, connections, addCard, updateCard, deleteCard, addConnection, deleteConnection } =
    useSpaceStore();
  const { screenToFlowPosition } = useReactFlow();

  // Filter cards by selected project (empty = all)
  const filteredCards = useMemo(
    () =>
      selectedProjectId
        ? cards.filter((c) => c.projectId === selectedProjectId)
        : cards,
    [cards, selectedProjectId]
  );

  const filteredCardIds = useMemo(
    () => new Set(filteredCards.map((c) => c.id)),
    [filteredCards]
  );

  const filteredConnections = useMemo(
    () =>
      connections.filter(
        (conn) => filteredCardIds.has(conn.fromCardId) && filteredCardIds.has(conn.toCardId)
      ),
    [connections, filteredCardIds]
  );

  const [nodes, setNodes] = useNodesState(filteredCards.map(cardToNode));
  const [edges, setEdges] = useEdgesState(filteredConnections.map(connectionToEdge));

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
        projectId: selectedProjectId || undefined,
        createdAt: new Date().toISOString(),
      };
      addCard(newCard);
      setNodes((nds) => [...nds, cardToNode(newCard)]);
    },
    [addCard, setNodes, selectedProjectId]
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
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={handleAddCard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-success-emphasis dark:bg-gh-dark-success-emphasis text-white rounded-md text-sm hover:opacity-90 shadow-sm font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add card
        </button>
        <div className="px-3 py-1.5 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md text-xs border border-gh-border-default dark:border-gh-dark-border-default shadow-sm text-gh-fg-muted dark:text-gh-dark-fg-muted">
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
  const { projects } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-full flex flex-col">
      {/* Project selector bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle border-b border-gh-border-default dark:border-gh-dark-border-default shrink-0">
        <svg className="w-4 h-4 text-gh-fg-muted dark:text-gh-dark-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
        </svg>
        <span className="text-sm font-medium text-gh-fg-default dark:text-gh-dark-fg-default">Project space:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedProjectId('')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              !selectedProjectId
                ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                : 'bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default'
            }`}
          >
            All projects
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedProjectId === p.id
                  ? 'text-white border-transparent'
                  : 'bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default'
              }`}
              style={
                selectedProjectId === p.id
                  ? { backgroundColor: p.color, borderColor: p.color }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedProjectId === p.id ? 'rgba(255,255,255,0.7)' : p.color }}
              />
              {p.name}
            </button>
          ))}
        </div>
        {selectedProject && (
          <span className="ml-auto text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted">
            Showing cards for <strong style={{ color: selectedProject.color }}>{selectedProject.name}</strong>
          </span>
        )}
      </div>

      {/* React Flow canvas */}
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <SpaceFlow selectedProjectId={selectedProjectId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

