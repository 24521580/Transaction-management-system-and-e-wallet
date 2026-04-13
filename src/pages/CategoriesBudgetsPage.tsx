import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store/useAppStore'
import { getBudgetUsage } from '../utils/analytics'
import { monthKey, formatCurrency } from '../utils/format'

export function CategoriesBudgetsPage() {
  const { categories, budgets, transactions, saveCategory, deleteCategory, saveBudget } = useAppStore((state) => ({
    categories: state.categories,
    budgets: state.budgets,
    transactions: state.transactions,
    saveCategory: state.saveCategory,
    deleteCategory: state.deleteCategory,
    saveBudget: state.saveBudget,
  }))

  const [categoryName, setCategoryName] = useState('')
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense')
  const [budgetCategory, setBudgetCategory] = useState('')
  const [budgetMonth, setBudgetMonth] = useState(monthKey(new Date().toISOString()))
  const [budgetLimit, setBudgetLimit] = useState('')

  const usage = useMemo(() => getBudgetUsage(transactions, budgets, budgetMonth), [transactions, budgets, budgetMonth])

  return (
    <div className="grid gap-4 pb-20 lg:grid-cols-2 lg:pb-8">
      <Card title="Quản lý danh mục thu/chi">
        <div className="space-y-3">
          <Input label="Tên danh mục" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Loại danh mục</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" value={categoryType} onChange={(event) => setCategoryType(event.target.value as 'income' | 'expense')}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <Button
            onClick={() => {
              if (!categoryName.trim()) return
              saveCategory({ name: categoryName.trim(), type: categoryType })
              setCategoryName('')
            }}
          >
            Thêm danh mục
          </Button>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-sm">
                <span>{category.name} ({category.type})</span>
                <Button variant="ghost" className="h-8 px-2 text-danger" onClick={() => deleteCategory(category.id)}>
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Ngân sách tháng và cảnh báo vượt mức">
        <div className="space-y-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Danh mục</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" value={budgetCategory} onChange={(event) => setBudgetCategory(event.target.value)}>
              <option value="">Chọn danh mục</option>
              {categories.filter((category) => category.type === 'expense').map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </label>
          <Input label="Tháng" type="month" value={budgetMonth} onChange={(event) => setBudgetMonth(event.target.value)} />
          <Input label="Giới hạn ngân sách" type="number" value={budgetLimit} onChange={(event) => setBudgetLimit(event.target.value)} />
          <Button
            onClick={() => {
              if (!budgetCategory || !Number(budgetLimit)) return
              saveBudget({ category: budgetCategory, month: budgetMonth, limit: Number(budgetLimit) })
              setBudgetLimit('')
            }}
          >
            Lưu ngân sách
          </Button>

          <div className="space-y-3 pt-2">
            {usage.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/70 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{item.category}</span>
                  <span className={item.status === 'danger' ? 'text-danger' : item.status === 'warning' ? 'text-warning' : 'text-success'}>
                    {item.usedPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full ${item.status === 'danger' ? 'bg-danger' : item.status === 'warning' ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${Math.min(item.usedPercent, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Đã dùng {formatCurrency(item.expense)} / {formatCurrency(item.limit)}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
