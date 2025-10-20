import api from './api';
import type { Project } from '../types';

// Get all
export const getAllProjects = async (): Promise<Project[]> => {
  const res = await api.get('/projects');
  return res.data;
};

// Add new
export const createProject = async (projectData: {
  title: string;
  tags: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
}): Promise<Project> => {
  const res = await api.post('/projects/create', projectData);
  return res.data;
};

// Delete
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// Update project
export const updateProject = async (id: string, projectData: FormData): Promise<Project> => {
  const res = await api.put(`/projects/${id}`, projectData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

