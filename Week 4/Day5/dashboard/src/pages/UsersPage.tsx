import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Alert from '../components/ui/Alert'
import { users as initialUsers } from '../data/mockData'
import type { User } from '../types'

export default function UsersPage() {
  const [list, setList] = useState<User[]>(initialUsers)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<User['role']>('Viewer')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs: { name?: string; email?: string } = {}
    if (name.trim().length < 3) errs.name = 'Name kam az kam 3 characters ka ho'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Sahi email likho'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setList((prev) => [...prev, { id: Date.now(), name, email, role, active: true }])
    setName('')
    setEmail('')
    setRole('Viewer')
    setOpen(false)
    setMessage('User kamyabi se add ho gaya!')
  }

  const toggleActive = (id: number) =>
    setList((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))

  const remove = (id: number) => setList((prev) => prev.filter((u) => u.id !== id))

  return (
    <div className="space-y-4">
      {message && <Alert onClose={() => setMessage('')}>{message}</Alert>}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">All Users</h3>
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Add User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-200">
              {list.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 pr-4 font-medium">{u.name}</td>
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="py-3 pr-4">
                    <Badge tone="blue">{u.role}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <button onClick={() => toggleActive(u.id)}>
                      <Badge tone={u.active ? 'green' : 'gray'}>{u.active ? 'Active' : 'Inactive'}</Badge>
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => remove(u.id)}
                      aria-label={`Delete ${u.name}`}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">No user .</p>
          )}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as User['role'])}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}