import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import CategoryChart from '../components/dashboard/CategoryChart'
import OrdersTable from '../components/dashboard/OrdersTable'
import Skeleton from '../components/ui/Skeleton'
import { orders } from '../data/mockData'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value="$45,231" change={12.5} icon={DollarSign} />
        <StatCard title="Total Orders" value="1,240" change={8.2} icon={ShoppingCart} />
        <StatCard title="New Customers" value="320" change={-3.1} icon={Users} />
        <StatCard title="Growth" value="24.5%" change={4.6} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <CategoryChart />
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}