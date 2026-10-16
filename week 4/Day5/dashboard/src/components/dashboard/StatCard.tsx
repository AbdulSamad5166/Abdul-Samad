import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Card from '../ui/Card'

interface Props {
  title: string
  value: string
  change: number
  icon: LucideIcon
}

export default function StatCard({ title, value, change, icon: Icon }: Props) {
  const positive = change >= 0
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
          <Icon size={22} />
        </div>
      </div>
      <p className={`mt-3 flex items-center gap-1 text-sm ${positive ? 'text-green-600' : 'text-red-500'}`}>
        {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(change)}% From last month
      </p>
    </Card>
  )
}