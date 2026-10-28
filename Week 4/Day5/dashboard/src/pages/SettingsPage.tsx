import { useState } from 'react'
import type { FormEvent } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function SettingsPage() {
  const [name, setName] = useState('Ali Khan')
  const [email, setEmail] = useState('ali@example.com')
  const [emailNotif, setEmailNotif] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {saved && <Alert onClose={() => setSaved(false)}>Settings saved !</Alert>}

      <Card title="Profile Settings">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            Email Notifications
          </label>

          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </div>
  )
}