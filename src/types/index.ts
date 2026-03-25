export type ID = string;

export interface Project {
  id: ID;
  name: string;
  color: string;
  createdAt: string;
}

export interface Tag {
  id: ID;
  name: string;
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskUrgency = 'low' | 'medium' | 'high';

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  urgency?: TaskUrgency;
  projectId?: ID;
  tagIds: ID[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: ID;
  title: string;
  content: string;
  projectId?: ID;
  tagIds: ID[];
  createdAt: string;
  updatedAt: string;
}

export interface SpaceCard {
  id: ID;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  projectId?: ID;
  noteId?: ID;
  createdAt: string;
}

export interface SpaceConnection {
  id: ID;
  fromCardId: ID;
  toCardId: ID;
}
