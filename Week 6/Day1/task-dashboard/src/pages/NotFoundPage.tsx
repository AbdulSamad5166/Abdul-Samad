import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DashboardIcon } from '../components/ui/Icons'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <Card className="max-w-md text-center p-8 sm:p-10 shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-2xl ring-8 ring-indigo-50/50">
          404
        </div>
        <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to a new URL.
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<DashboardIcon className="h-4 w-4" />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}