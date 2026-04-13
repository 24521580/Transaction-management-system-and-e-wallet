import { motion } from 'framer-motion'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'
import { getDashboardSummary, getTopExpenseCategories } from '../utils/analytics'
import { formatCurrency, monthKey } from '../utils/format'

const chartColors = ['#007AFF', '#34C759', '#FF9F0A', '#FF3B30', '#AF52DE']

export function DashboardPage() {
  const { transactions, currentBalance } = useAppStore((state) => ({ transactions: state.transactions, currentBalance: state.currentBalance }))
  const summary = getDashboardSummary(transactions, currentBalance, monthKey(new Date().toISOString()))
  const topCategories = getTopExpenseCategories(transactions)

  const trendData = [...transactions]
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(-12)
    .map((transaction) => ({
      day: transaction.date.slice(5),
      income: transaction.type === 'income' ? transaction.amount : 0,
      expense: transaction.type === 'expense' ? transaction.amount : 0,
    }))

  const recent = transactions.slice(0, 5)

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Số dư ví', value: formatCurrency(summary.balance), color: 'text-primary' },
          { title: 'Tổng thu tháng', value: formatCurrency(summary.totalIncome), color: 'text-success' },
          { title: 'Tổng chi tháng', value: formatCurrency(summary.totalExpense), color: 'text-danger' },
          { title: 'Chênh lệch', value: formatCurrency(summary.net), color: summary.net >= 0 ? 'text-success' : 'text-danger' },
        ].map((item, index) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card>
              <p className="text-sm text-slate-500">{item.title}</p>
              <p className={`mt-2 text-xl font-bold ${item.color}`}>{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Biến động thu chi">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Line type="monotone" dataKey="income" stroke="#34C759" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#FF3B30" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top 5 danh mục chi tiêu">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} dataKey="total" nameKey="name" innerRadius={60} outerRadius={95}>
                  {topCategories.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Giao dịch gần đây">
        <div className="space-y-2">
          {recent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.category} • {item.date}</p>
              </div>
              <p className={`text-sm font-semibold ${item.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
