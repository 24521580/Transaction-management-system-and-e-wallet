import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'
import { reportService } from '../services/api/reportService'
import { formatCurrency, monthKey } from '../utils/format'

const colors = ['#007AFF', '#34C759', '#FF9F0A', '#FF3B30', '#AF52DE', '#5AC8FA']

export function ReportsPage() {
  const transactions = useAppStore((state) => state.transactions)

  const categoryPie = Object.entries(
    transactions
      .filter((item) => item.type === 'expense')
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + item.amount
        return acc
      }, {}),
  ).map(([name, value]) => ({ name, value }))

  const monthlyBar = Object.entries(
    transactions.reduce<Record<string, number>>((acc, item) => {
      const key = monthKey(item.date)
      acc[key] = (acc[key] ?? 0) + (item.type === 'income' ? item.amount : -item.amount)
      return acc
    }, {}),
  ).map(([month, total]) => ({ month, total }))

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Biểu đồ tròn theo danh mục">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryPie} dataKey="value" nameKey="name" innerRadius={68} outerRadius={110}>
                  {categoryPie.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Biểu đồ cột theo tháng">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="total" fill="#007AFF" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Xuất báo cáo">
        <Button
          onClick={async () => {
            const csv = await reportService.exportCsv()
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'transactions-report.csv'
            anchor.click()
            URL.revokeObjectURL(url)
          }}
        >
          Export CSV
        </Button>
      </Card>
    </div>
  )
}
