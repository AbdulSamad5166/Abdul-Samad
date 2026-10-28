import { useState } from 'react'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === 'dashboard' && <DashboardPage />}
      {page === 'users' && <UsersPage />}
      {page === 'settings' && <SettingsPage />}
    </Layout>
  )
}