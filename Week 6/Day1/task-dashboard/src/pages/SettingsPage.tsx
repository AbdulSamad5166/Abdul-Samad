import { useState, type FormEvent } from 'react'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  CheckIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from '../components/ui/Icons'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Toggle } from '../components/ui/Toggle'

export function SettingsPage() {
  // Profile form state (UI only)
  const [name, setName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex.morgan@taskflow.dev')
  const [title, setTitle] = useState('Lead Frontend Architect')
  const [bio, setBio] = useState('Designing and architecting high-velocity web applications.')
  const [isSaved, setIsSaved] = useState(false)

  // Notification toggles state (UI only)
  const [assignmentNotifs, setAssignmentNotifs] = useState(true)
  const [digestEmails, setDigestEmails] = useState(true)
  const [deadlineAlerts, setDeadlineAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  // Theme selector state (UI only)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage workspace preferences, personal profile, and notifications."
      />

      <div className="space-y-6 max-w-4xl">
        {/* Profile Information */}
        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Profile Details</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update your public profile, title, and contact address.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-5 space-y-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              <Avatar name={name} size="xl" status="online" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{name}</p>
                <div className="mt-1.5 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => alert('Change avatar modal (UI demo)')}
                  >
                    Change photo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => alert('Photo removed (UI demo)')}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Job Title / Role"
              id="profile-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Bio
              </label>
              <textarea
                id="profile-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span
                className={`text-xs font-semibold text-emerald-600 transition-opacity ${
                  isSaved ? 'opacity-100' : 'opacity-0'
                }`}
              >
                ✓ Changes saved successfully!
              </span>
              <Button type="submit" variant="primary" leftIcon={<CheckIcon className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Choose how you want to be notified about tasks, sprint updates, and deadlines.
            </p>
          </div>

          <div className="mt-5 space-y-4 divide-y divide-slate-100">
            <div className="pt-2">
              <Toggle
                id="notif-assignments"
                checked={assignmentNotifs}
                onChange={setAssignmentNotifs}
                label="Task assignments"
                description="Get notified immediately when tasks or subtasks are assigned to you."
              />
            </div>

            <div className="pt-4">
              <Toggle
                id="notif-digest"
                checked={digestEmails}
                onChange={setDigestEmails}
                label="Daily digest email"
                description="Receive an email overview of upcoming tasks and priority blockers each morning."
              />
            </div>

            <div className="pt-4">
              <Toggle
                id="notif-deadlines"
                checked={deadlineAlerts}
                onChange={setDeadlineAlerts}
                label="Deadline warnings"
                description="Alert me 24 hours prior to a scheduled task due date."
              />
            </div>

            <div className="pt-4">
              <Toggle
                id="notif-reports"
                checked={weeklyReports}
                onChange={setWeeklyReports}
                label="Weekly productivity analytics"
                description="Receive a comprehensive sprint velocity summary every Friday."
              />
            </div>
          </div>
        </Card>

        {/* Theme Selector */}
        <Card>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Appearance & Theme</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Customize how TaskFlow looks on your screen.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Light Theme Option */}
            <div
              onClick={() => setTheme('light')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <SunIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Light</p>
                <p className="text-[11px] text-slate-500">Crisp neutral style</p>
              </div>
            </div>

            {/* Dark Theme Option */}
            <div
              onClick={() => setTheme('dark')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <MoonIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Dark</p>
                <p className="text-[11px] text-slate-500">Easy on the eyes</p>
              </div>
            </div>

            {/* System Theme Option */}
            <div
              onClick={() => setTheme('system')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                theme === 'system'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  theme === 'system' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <MonitorIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">System</p>
                <p className="text-[11px] text-slate-500">Sync with OS mode</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
