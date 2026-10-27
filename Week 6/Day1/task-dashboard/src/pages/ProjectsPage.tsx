import { useState } from 'react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CalendarIcon, PlusIcon, SearchIcon, TasksIcon } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'

interface Project {
  id: string
  name: string
  category: string
  description: string
  progress: number
  tasksCompleted: number
  totalTasks: number
  dueDate: string
  status: 'In Progress' | 'On Track' | 'Planning' | 'Completed'
  tone: 'indigo' | 'emerald' | 'amber' | 'blue'
  members: Array<{ name: string; avatar?: string }>
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Design System 2.0',
    category: 'Design & UX',
    description: 'Unified component library, color tokens, and accessibility guidelines across web apps.',
    progress: 75,
    tasksCompleted: 18,
    totalTasks: 24,
    dueDate: '15 Nov 2026',
    status: 'In Progress',
    tone: 'indigo',
    members: [{ name: 'Alex Morgan' }, { name: 'Devon Vance' }, { name: 'Sarah Jenkins' }],
  },
  {
    id: 'proj-2',
    name: 'Mobile App Redesign',
    category: 'Mobile Dev',
    description: 'Native iOS and Android user experience overhaul with offline synchronization.',
    progress: 40,
    tasksCompleted: 8,
    totalTasks: 20,
    dueDate: '01 Dec 2026',
    status: 'In Progress',
    tone: 'blue',
    members: [{ name: 'Alex Morgan' }, { name: 'Sarah Jenkins' }],
  },
  {
    id: 'proj-3',
    name: 'API Gateway & Security Audit',
    category: 'Infrastructure',
    description: 'Rate limiting, OAuth2 provider integration, and compliance security verification.',
    progress: 90,
    tasksCompleted: 19,
    totalTasks: 21,
    dueDate: '31 Oct 2026',
    status: 'On Track',
    tone: 'emerald',
    members: [{ name: 'Devon Vance' }, { name: 'Alex Morgan' }],
  },
  {
    id: 'proj-4',
    name: 'Customer Analytics Portal',
    category: 'Analytics',
    description: 'Interactive dashboard showing customer churn, lifetime value, and cohort retention.',
    progress: 100,
    tasksCompleted: 15,
    totalTasks: 15,
    dueDate: '20 Oct 2026',
    status: 'Completed',
    tone: 'emerald',
    members: [{ name: 'Sarah Jenkins' }, { name: 'Alex Morgan' }, { name: 'Devon Vance' }],
  },
  {
    id: 'proj-5',
    name: 'Cloud Database Migration',
    category: 'DevOps',
    description: 'Zero-downtime database migration to distributed global read replicas.',
    progress: 25,
    tasksCompleted: 4,
    totalTasks: 16,
    dueDate: '20 Dec 2026',
    status: 'Planning',
    tone: 'amber',
    members: [{ name: 'Devon Vance' }],
  },
  {
    id: 'proj-6',
    name: 'Billing & Invoicing Engine',
    category: 'Finance',
    description: 'Multi-currency subscription billing, VAT compliance, and Stripe Webhook handlers.',
    progress: 60,
    tasksCompleted: 12,
    totalTasks: 20,
    dueDate: '25 Nov 2026',
    status: 'In Progress',
    tone: 'indigo',
    members: [{ name: 'Alex Morgan' }, { name: 'Devon Vance' }],
  },
]

export function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const categories = ['All', 'Design & UX', 'Mobile Dev', 'Infrastructure', 'Analytics', 'DevOps']

  const filteredProjects = SAMPLE_PROJECTS.filter((proj) => {
    const matchesFilter = filter === 'All' || proj.category === filter
    const matchesSearch =
      proj.name.toLowerCase().includes(search.toLowerCase()) ||
      proj.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <PageHeader
        title="Projects"
        description="Organize key initiatives, team allocations, and milestone deliverables."
        action={
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => alert('New Project Dialog (UI demo)')}
          >
            New Project
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {project.category}
                </span>
                <Badge
                  dot
                  tone={
                    project.status === 'Completed'
                      ? 'green'
                      : project.status === 'On Track'
                      ? 'green'
                      : project.status === 'Planning'
                      ? 'amber'
                      : 'blue'
                  }
                >
                  {project.status}
                </Badge>
              </div>

              <h2 className="mt-3 text-base font-semibold text-slate-900 leading-snug">
                {project.name}
              </h2>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="mb-2">
                <ProgressBar
                  value={project.progress}
                  tone={project.tone}
                  showPercentage
                  label="Progress"
                  size="sm"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <TasksIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {project.tasksCompleted}/{project.totalTasks} tasks
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{project.dueDate}</span>
                </div>
              </div>

              {/* Members Avatar Stack */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-400">Team</span>
                <div className="flex -space-x-1.5 overflow-hidden">
                  {project.members.map((member) => (
                    <Avatar
                      key={member.name}
                      name={member.name}
                      size="xs"
                      className="ring-2 ring-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
