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
import { useNoteStore } from '../../store/noteStore';
import type { SpaceCard, SpaceConnection, Note } from '../../types';
import { SpaceCardNode } from './SpaceCardNode';
import { SpaceEdge } from './SpaceEdge';

const GRID_SIZE = 20;
const snapToGrid = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

const NOTE_CARD_GRID_COLS = 4;
const NOTE_CARD_START_X = 100;
const NOTE_CARD_START_Y = 100;
const NOTE_CARD_SPACING_X = 260;
const NOTE_CARD_SPACING_Y = 200;
const NOTE_CARD_PREVIEW_LEN = 120;

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
    data: { content: card.content, projectId: card.projectId, noteId: card.noteId },
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

/** Strip HTML tags for note card content preview */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface SpaceFlowProps {
  selectedProjectId: string;
}

function SpaceFlow({ selectedProjectId }: SpaceFlowProps) {
  const { cards, connections, addCard, updateCard, deleteCard, addConnection, deleteConnection } =
    useSpaceStore();
  const { notes } = useNoteStore();
  const { projects } = useProjectStore();
  const { screenToFlowPosition } = useReactFlow();

  const [showNotesPanel, setShowNotesPanel] = useState(false);

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

  // Notes filtered by project for the notes panel
  const panelNotes = useMemo(
    () =>
      selectedProjectId
        ? notes.filter((n) => n.projectId === selectedProjectId)
        : notes,
    [notes, selectedProjectId]
  );

  // Which note ids are already placed in the space (for this project view)
  const placedNoteIds = useMemo(
    () => new Set(filteredCards.filter((c) => c.noteId).map((c) => c.noteId as string)),
    [filteredCards]
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
    (x: number, y: number, extraData?: Partial<SpaceCard>) => {
      const id = nanoid();
      const newCard: SpaceCard = {
        id,
        content: '',
        x: snapToGrid(x),
        y: snapToGrid(y),
        width: 220,
        height: 160,
        projectId: selectedProjectId || undefined,
        createdAt: new Date().toISOString(),
        ...extraData,
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
        target.closest('.react-flow__controls') ||
        target.closest('[data-notes-panel]')
      )
        return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      createCard(pos.x, pos.y);
    },
    [screenToFlowPosition, createCard]
  );

  /** Add a note from the Notes tab as a space card */
  const addNoteToSpace = useCallback(
    (note: Note) => {
      const col = filteredCards.length % NOTE_CARD_GRID_COLS;
      const row = Math.floor(filteredCards.length / NOTE_CARD_GRID_COLS);
      const plain = stripHtml(note.content);
      const content = plain ? `${note.title}\n\n${plain.slice(0, NOTE_CARD_PREVIEW_LEN)}` : note.title;
      createCard(NOTE_CARD_START_X + col * NOTE_CARD_SPACING_X, NOTE_CARD_START_Y + row * NOTE_CARD_SPACING_Y, {
        content,
        noteId: note.id,
        projectId: selectedProjectId || note.projectId,
        width: 240,
        height: 180,
      });
    },
    [createCard, filteredCards.length, selectedProjectId]
  );

  const colorMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)
    : null;

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
        <button
          onClick={() => setShowNotesPanel((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm shadow-sm font-medium border transition-colors ${
            showNotesPanel
              ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
              : 'bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-default dark:text-gh-dark-fg-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Notes
          {panelNotes.length > 0 && (
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${showNotesPanel ? 'bg-white/20' : 'bg-gh-accent-subtle dark:bg-gh-dark-accent-subtle text-gh-accent-fg dark:text-gh-dark-accent-fg'}`}>
              {panelNotes.length}
            </span>
          )}
        </button>
        <div className="px-3 py-1.5 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md text-xs border border-gh-border-default dark:border-gh-dark-border-default shadow-sm text-gh-fg-muted dark:text-gh-dark-fg-muted">
          Double-click canvas to add · Drag handle to connect
        </div>
      </div>

      {/* Notes panel */}
      {showNotesPanel && (
        <div
          data-notes-panel="true"
          className="absolute top-14 left-3 z-20 w-72 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-lg border border-gh-border-default dark:border-gh-dark-border-default shadow-lg overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100% - 5rem)' }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset shrink-0">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gh-fg-muted dark:text-gh-dark-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs font-semibold text-gh-fg-default dark:text-gh-dark-fg-default uppercase tracking-wide">
                {selectedProject ? `${selectedProject.name} notes` : 'All notes'}
              </span>
            </div>
            <button
              onClick={() => setShowNotesPanel(false)}
              className="w-5 h-5 flex items-center justify-center rounded text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {panelNotes.length === 0 ? (
              <p className="text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted text-center py-6 px-4">
                {selectedProject
                  ? `No notes in "${selectedProject.name}". Assign notes to this project in the Notes tab.`
                  : 'No notes yet. Create notes in the Notes tab.'}
              </p>
            ) : (
              panelNotes.map((note) => {
                const alreadyPlaced = placedNoteIds.has(note.id);
                const noteProject = projects.find((p) => p.id === note.projectId);
                return (
                  <div
                    key={note.id}
                    className="flex items-start gap-2 px-3 py-2.5 border-b border-gh-border-muted dark:border-gh-dark-border-muted last:border-0 hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gh-fg-default dark:text-gh-dark-fg-default truncate">
                        {note.title || 'Untitled Note'}
                      </p>
                      {noteProject && !selectedProjectId && (
                        <span
                          className="inline-flex items-center gap-1 mt-0.5 text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: noteProject.color }}
                          />
                          {noteProject.name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => !alreadyPlaced && addNoteToSpace(note)}
                      disabled={alreadyPlaced}
                      title={alreadyPlaced ? 'Already in space' : 'Add to space'}
                      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        alreadyPlaced
                          ? 'text-gh-fg-muted dark:text-gh-dark-fg-muted bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default cursor-default'
                          : 'bg-gh-accent-emphasis text-white hover:opacity-90'
                      }`}
                    >
                      {alreadyPlaced ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Added
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

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
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle border-b border-gh-border-default dark:border-gh-dark-border-default shrink-0 flex-wrap">
        <svg className="w-4 h-4 shrink-0 text-gh-fg-muted dark:text-gh-dark-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
        </svg>
        <span className="text-sm font-medium text-gh-fg-default dark:text-gh-dark-fg-default shrink-0">Project:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedProjectId('')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              !selectedProjectId
                ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis'
                : 'bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default border-gh-border-default dark:border-gh-dark-border-default text-gh-fg-muted dark:text-gh-dark-fg-muted hover:text-gh-fg-default dark:hover:text-gh-dark-fg-default'
            }`}
          >
            All
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
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: selectedProjectId === p.id ? 'rgba(255,255,255,0.7)' : p.color }}
              />
              {p.name}
            </button>
          ))}
        </div>
        {selectedProject && (
          <span className="ml-auto text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted shrink-0">
            Showing <strong style={{ color: selectedProject.color }}>{selectedProject.name}</strong> cards
          </span>
        )}
      </div>

      {/* React Flow canvas — key resets the canvas when the project changes */}
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider key={selectedProjectId}>
          <SpaceFlow selectedProjectId={selectedProjectId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
