import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { SpaceCard, SpaceConnection, ID } from '../types';

interface SpaceState {
  cards: SpaceCard[];
  connections: SpaceConnection[];
  addCard: (card: Omit<SpaceCard, 'createdAt'>) => void;
  updateCard: (id: ID, updates: Partial<Omit<SpaceCard, 'id' | 'createdAt'>>) => void;
  deleteCard: (id: ID) => void;
  addConnection: (fromCardId: ID, toCardId: ID) => void;
  deleteConnection: (id: ID) => void;
  cleanupNoteRef: (noteId: ID) => void;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set) => ({
      cards: [],
      connections: [],
      addCard: (card) =>
        set((state) => ({
          cards: [
            ...state.cards,
            { ...card, createdAt: new Date().toISOString() },
          ],
        })),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
          connections: state.connections.filter(
            (conn) => conn.fromCardId !== id && conn.toCardId !== id
          ),
        })),
      addConnection: (fromCardId, toCardId) =>
        set((state) => ({
          connections: [
            ...state.connections,
            { id: nanoid(), fromCardId, toCardId },
          ],
        })),
      deleteConnection: (id) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== id),
        })),
      cleanupNoteRef: (noteId) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.noteId === noteId ? { ...c, noteId: undefined } : c
          ),
        })),
    }),
    { name: 'devtools-space' }
  )
);
