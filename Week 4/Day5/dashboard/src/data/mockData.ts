import type { Order, User } from '../types'

export const orders: Order[] = [
  { id: '#1001', customer: 'Ali Khan', product: 'Laptop', amount: 1200, status: 'Completed', date: '2026-10-01' },
  { id: '#1002', customer: 'Sara Ahmed', product: 'Headphones', amount: 150, status: 'Pending', date: '2026-10-02' },
  { id: '#1003', customer: 'Usman Raza', product: 'Smartphone', amount: 800, status: 'Completed', date: '2026-10-03' },
  { id: '#1004', customer: 'Ayesha Noor', product: 'Keyboard', amount: 90, status: 'Cancelled', date: '2026-10-04' },
  { id: '#1005', customer: 'Hamza Ali', product: 'Monitor', amount: 320, status: 'Completed', date: '2026-10-05' },
  { id: '#1006', customer: 'Fatima Zahra', product: 'Mouse', amount: 40, status: 'Pending', date: '2026-10-06' },
  { id: '#1007', customer: 'Bilal Hassan', product: 'Tablet', amount: 450, status: 'Completed', date: '2026-10-07' },
  { id: '#1008', customer: 'Zainab Malik', product: 'Smartwatch', amount: 210, status: 'Pending', date: '2026-10-08' },
  { id: '#1009', customer: 'Omar Farooq', product: 'Camera', amount: 950, status: 'Completed', date: '2026-10-09' },
  { id: '#1010', customer: 'Hira Tariq', product: 'Speaker', amount: 120, status: 'Cancelled', date: '2026-10-10' },
  { id: '#1011', customer: 'Danish Iqbal', product: 'Printer', amount: 260, status: 'Completed', date: '2026-10-11' },
  { id: '#1012', customer: 'Mariam Shah', product: 'Router', amount: 75, status: 'Pending', date: '2026-10-12' },
]

export const users: User[] = [
  { id: 1, name: 'Ali Khan', email: 'ali@example.com', role: 'Admin', active: true },
  { id: 2, name: 'Sara Ahmed', email: 'sara@example.com', role: 'Editor', active: true },
  { id: 3, name: 'Usman Raza', email: 'usman@example.com', role: 'Viewer', active: false },
  { id: 4, name: 'Ayesha Noor', email: 'ayesha@example.com', role: 'Editor', active: true },
]

export const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 4800 },
  { month: 'May', revenue: 6100 },
  { month: 'Jun', revenue: 7200 },
  { month: 'Jul', revenue: 6800 },
  { month: 'Aug', revenue: 8100 },
]

export const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Accessories', value: 300 },
  { name: 'Mobiles', value: 250 },
  { name: 'Others', value: 120 },
]