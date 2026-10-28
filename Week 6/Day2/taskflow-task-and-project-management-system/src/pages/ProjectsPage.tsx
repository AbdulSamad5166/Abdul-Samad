import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons';
import { projectSchema } from '../schemas/project';
import { calculateProgressPercentage } from '../utils/formatters';
import { Project } from '../types';

const COLOR_PRESETS = [
  '#0d9488', // Teal
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#0284c7', // Sky
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: tasks = [] } = useTasks();

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setColor(COLOR_PRESETS[0]);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setColor(project.color);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = projectSchema.safeParse({ name, description, color });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (editingProject) {
      await updateProjectMutation.mutateAsync({
        projectId: editingProject.id,
        updates: { name, description, color },
      });
    } else {
      await createProjectMutation.mutateAsync({ name, description, color });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProjectId) return;
    await deleteProjectMutation.mutateAsync(deletingProjectId);
    setDeletingProjectId(null);
  };

  if (projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        pill="Projects"
        title="Projects & Workspaces"
        description="Organize your team tasks into high-level categories and monitor progress"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Create Project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <Card>
          <EmptyState
            title="No projects yet"
            description="Create projects to categorize your tasks and track completion milestones."
            actionLabel="Create Project"
            onAction={handleOpenCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
            const progress = calculateProgressPercentage(completedTasks, totalTasks);

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Top: Color badge & action buttons */}
                  <div className="flex items-start justify-between">
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-4 ring-slate-100 dark:ring-slate-800"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        aria-label={`Edit project ${project.name}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProjectId(project.id)}
                        aria-label={`Delete project ${project.name}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress bar & Task count */}
                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    <span>
                      {completedTasks} / {totalTasks} Tasks
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} color="bg-primary" size="sm" />

                  <div className="mt-4 flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/tasks?project=${project.id}`)}
                      className="text-xs text-primary"
                    >
                      View Tasks &rarr;
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Growth Marketing Sprint"
            error={errors.name}
          />

          <Textarea
            label="Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objectives, deliverables, or team scope..."
            error={errors.description}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Color Accent Badge
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  aria-label={`Select color ${preset}`}
                  className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${
                    color === preset ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Project Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProjectId}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? Existing tasks will remain in your workspace."
        confirmLabel="Delete Project"
        isDestructive
        isLoading={deleteProjectMutation.isPending}
      />
    </div>
  );
};
