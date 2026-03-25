import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Project, Tag, ID } from '../types';

interface ProjectState {
  projects: Project[];
  tags: Tag[];
  addProject: (name: string, color: string) => void;
  updateProject: (id: ID, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: ID) => void;
  addTag: (name: string) => void;
  updateTag: (id: ID, name: string) => void;
  deleteTag: (id: ID) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      tags: [],
      addProject: (name, color) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { id: nanoid(), name, color, createdAt: new Date().toISOString() },
          ],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      addTag: (name) =>
        set((state) => ({
          tags: [
            ...state.tags,
            { id: nanoid(), name, createdAt: new Date().toISOString() },
          ],
        })),
      updateTag: (id, name) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, name } : t)),
        })),
      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        })),
    }),
    { name: 'devtools-projects' }
  )
);
