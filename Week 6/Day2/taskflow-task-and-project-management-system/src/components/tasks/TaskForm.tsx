import React, { useState } from 'react';
import { Project, Task, TaskPriority, TaskStatus } from '../../types';
import { taskSchema } from '../../schemas/task';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { PlusIcon, TrashIcon } from '../icons';
import { getTodayDateString } from '../../utils/dateHelpers';

interface TaskFormProps {
  initialTask?: Task | null;
  initialStatus?: TaskStatus;
  projects: Project[];
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    projectId: string;
    tags: string[];
    subtasks?: { title: string }[];
  }) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  initialStatus,
  projects,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const defaultProjectId = projects.length > 0 ? projects[0].id : '';

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || initialStatus || 'pending');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || getTodayDateString());
  const [projectId, setProjectId] = useState(initialTask?.projectId || defaultProjectId);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTask?.tags || []);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>(
    initialTask?.subtasks?.map((s) => ({ id: s.id, title: s.title })) || []
  );
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `temp_${Date.now()}_${Math.random()}`, title: newSubtaskInput.trim() },
      ]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod schema
    const result = taskSchema.safeParse({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      tags,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      tags,
      subtasks: subtasks.map((s) => ({ title: s.title })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Title */}
      <Input
        label="Task Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Audit database indexes and optimize queries"
        error={errors.title}
      />

      {/* Description */}
      <Textarea
        label="Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add context, acceptance criteria, or technical notes..."
        error={errors.description}
      />

      {/* Grid: Status, Priority, Due Date, Project */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
        />

        <Input
          label="Due Date"
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />

        <Select
          label="Project / Category"
          required
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projects.map((p) => ({ value: p.id, label: p.name }))}
          error={errors.projectId}
        />
      </div>

      {/* Tags section */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Type tag and press Add..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="button" size="sm" variant="secondary" onClick={handleAddTag}>
            Add Tag
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtasks checklist builder (only on create/new) */}
      {!initialTask && (
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Initial Checklist / Subtasks
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskInput}
              onChange={(e) => setNewSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="e.g., Code review with team..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
              onClick={handleAddSubtask}
            >
              Add
            </Button>
          </div>

          {subtasks.length > 0 && (
            <ul className="space-y-1.5 max-h-36 overflow-y-auto">
              {subtasks.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-slate-800/60"
                >
                  <span className="truncate">{s.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(s.id)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
