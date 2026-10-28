import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project } from '../types';
import { projectService } from '../services/projectService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export const PROJECT_QUERY_KEYS = {
  all: (userId: string | undefined) => ['projects', userId] as const,
};

export function useProjects() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.all(userId),
    queryFn: async () => {
      if (!userId) return [];
      return projectService.getProjects(userId);
    },
    enabled: !!userId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; color: string }) => {
      if (!user) throw new Error('Not logged in');
      return projectService.createProject(user.id, data);
    },
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all(user?.id) });
      toast.success(`Project "${newProj.name}" created!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      if (!user) throw new Error('Not logged in');
      return projectService.updateProject(user.id, projectId, updates);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all(user?.id) });
      toast.success(`Project "${updated.name}" updated!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!user) throw new Error('Not logged in');
      return projectService.deleteProject(user.id, projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all(user?.id) });
      toast.info('Project deleted');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete project');
    },
  });
}
