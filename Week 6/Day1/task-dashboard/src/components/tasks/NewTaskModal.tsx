import { useState, type FormEvent } from 'react'
import type { TaskPriority, TaskStatus } from '../../types/task'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('pending')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // As per specification: UI-only in this step, do not create or modify tasks yet
    setTitle('')
    setDescription('')
    setPriority('medium')
    setStatus('pending')
    setDueDate('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a task to track deliverables, milestones, and assignments."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-task-form">
            Create Task
          </Button>
        </>
      }
    >
      <form id="new-task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          id="task-title"
          placeholder="e.g., Conduct design system audit"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label htmlFor="task-description" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Briefly describe what needs to be done..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Priority"
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: 'low', label: 'Low Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'high', label: 'High Priority' },
            ]}
          />

          <Select
            label="Initial Status"
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>

        <Input
          label="Due Date"
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </form>
    </Modal>
  )
}
