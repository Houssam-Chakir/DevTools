import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Task, TaskStatus, ID } from '../types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: ID, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: ID) => void;
  moveTask: (id: ID, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: nanoid(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => {
          const toDelete = new Set<string>();
          toDelete.add(id);
          // cascade delete subtasks
          let changed = true;
          while (changed) {
            changed = false;
            state.tasks.forEach((t) => {
              if (t.parentTaskId && toDelete.has(t.parentTaskId) && !toDelete.has(t.id)) {
                toDelete.add(t.id);
                changed = true;
              }
            });
          }
          return { tasks: state.tasks.filter((t) => !toDelete.has(t.id)) };
        }),
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status, updatedAt: new Date().toISOString() }
              : t
          ),
        })),
    }),
    { name: 'devtools-tasks' }
  )
);
