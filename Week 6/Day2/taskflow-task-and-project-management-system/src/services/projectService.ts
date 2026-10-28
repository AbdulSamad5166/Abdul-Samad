import { Project } from '../types';
import { generateId } from '../utils/id';
import { getUserProjectsKey, safeLocalStorage } from './storage';

export const projectService = {
  async getProjects(userId: string): Promise<Project[]> {
    if (!userId) return [];
    const userKey = getUserProjectsKey(userId);
    return safeLocalStorage.get<Project[]>(userKey, []);
  },

  async getProjectById(userId: string, projectId: string): Promise<Project | null> {
    const projects = await this.getProjects(userId);
    return projects.find((p) => p.id === projectId) || null;
  },

  async createProject(
    userId: string,
    data: { name: string; description: string; color: string }
  ): Promise<Project> {
    const newProject: Project = {
      id: generateId('proj'),
      name: data.name.trim(),
      description: data.description.trim(),
      color: data.color,
      createdAt: new Date().toISOString(),
      userId,
    };

    const userKey = getUserProjectsKey(userId);
    const projects = safeLocalStorage.get<Project[]>(userKey, []);
    safeLocalStorage.set(userKey, [newProject, ...projects]);
    return newProject;
  },

  async updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Project> {
    const userKey = getUserProjectsKey(userId);
    const projects = safeLocalStorage.get<Project[]>(userKey, []);
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) {
      throw new Error('Project not found.');
    }

    const updated: Project = {
      ...projects[index],
      ...updates,
    };

    projects[index] = updated;
    safeLocalStorage.set(userKey, projects);
    return updated;
  },

  async deleteProject(userId: string, projectId: string): Promise<void> {
    const userKey = getUserProjectsKey(userId);
    const projects = safeLocalStorage.get<Project[]>(userKey, []);
    const remaining = projects.filter((p) => p.id !== projectId);
    safeLocalStorage.set(userKey, remaining);
  },
};
