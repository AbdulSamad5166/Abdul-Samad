import type { Task } from '../types/task'

// Pehli dafa app khulne par ye sample data dikhega (Day 3 me API se replace hoga)
export const SEED_TASKS: Task[] = [
  { id: 't-1', title: 'Design landing page', description: 'Create wireframes and final layout for the marketing landing page.', status: 'in-progress', priority: 'high', dueDate: '2026-10-30', createdAt: '2026-10-20' },
  { id: 't-2', title: 'Write API documentation', description: 'Document all REST endpoints with request and response examples.', status: 'pending', priority: 'medium', dueDate: '2026-11-04', createdAt: '2026-10-21' },
  { id: 't-3', title: 'Fix navbar bug on mobile', description: 'Hamburger menu does not close after selecting a link.', status: 'completed', priority: 'high', dueDate: '2026-10-25', createdAt: '2026-10-18' },
  { id: 't-4', title: 'Set up CI pipeline', description: 'Run lint and type-check on every pull request.', status: 'pending', priority: 'low', dueDate: '2026-11-10', createdAt: '2026-10-22' },
  { id: 't-5', title: 'Review pull requests', description: 'Review the open pull requests from the team before Friday.', status: 'in-progress', priority: 'medium', dueDate: '2026-10-28', createdAt: '2026-10-23' },
  { id: 't-6', title: 'Prepare weekly report', description: 'Summarize completed work and blockers for the weekly sync.', status: 'completed', priority: 'low', dueDate: '2026-10-24', createdAt: '2026-10-19' },
]