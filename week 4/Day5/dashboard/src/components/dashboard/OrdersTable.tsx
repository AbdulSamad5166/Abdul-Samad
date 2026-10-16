import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import type { Order, OrderStatus } from '../../types'

type SortKey = 'amount' | 'date'
const PAGE_SIZE = 5

const tone = { Completed: 'green', Pending: 'yellow', Cancelled: 'red' } as const

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'All' | OrderStatus>('All')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [asc, setAsc] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = orders.filter(
      (o) =>
        (status === 'All' || o.status === status) &&
        `${o.id} ${o.customer} ${o.product}`.toLowerCase().includes(q),
    )
    return list.sort((a, b) => {
      const r = sortKey === 'amount' ? a.amount - b.amount : a.date.localeCompare(b.date)
      return asc ? r : -r
    })
  }, [orders, search, status, sortKey, asc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  return (
    <Card title="Recent Orders">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search order, customer, product..."
          aria-label="Search orders"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'All' | OrderStatus)
            setPage(1)
          }}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <tr>
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">
                <button onClick={() => toggleSort('amount')} className="flex items-center gap-1">
                  Amount <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3">
                <button onClick={() => toggleSort('date')} className="flex items-center gap-1">
                  Date <ArrowUpDown size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-200">
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-3 pr-4 font-medium">{o.id}</td>
                <td className="py-3 pr-4">{o.customer}</td>
                <td className="py-3 pr-4">{o.product}</td>
                <td className="py-3 pr-4">${o.amount}</td>
                <td className="py-3 pr-4">
                  <Badge tone={tone[o.status]}>{o.status}</Badge>
                </td>
                <td className="py-3">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="py-10 text-center text-slate-500 dark:text-slate-400">NO Order received .</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}