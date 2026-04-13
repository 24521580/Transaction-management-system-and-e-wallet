import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const features = [
  'Theo dõi thu/chi thời gian thực',
  'Quản lý ngân sách thông minh và cảnh báo vượt mức',
  'Báo cáo trực quan với biểu đồ động',
]

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Card className="overflow-hidden p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <p className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">iOS-inspired Experience</p>
            <h1 className="max-w-2xl text-3xl font-bold text-slate-900 md:text-5xl">Transaction Management System & E-Wallet</h1>
            <p className="mt-3 max-w-2xl text-slate-500">Nền tảng quản lý tài chính cá nhân hiện đại, tối ưu cho desktop, tablet và mobile.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login">
                <Button>Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Đăng ký</Button>
              </Link>
            </div>
          </motion.div>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.08 }}>
              <Card className="h-full">
                <p className="text-sm text-slate-600">{feature}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
