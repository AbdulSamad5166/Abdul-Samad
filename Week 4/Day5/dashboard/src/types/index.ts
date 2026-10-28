export type Page = 'dashboard' | 'users' | 'settings'
export type OrderStatus = 'Completed' | 'Pending' | 'Cancelled'

export interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: OrderStatus
  date: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  active: boolean
}