import type { Budget, DashboardSummary, Transaction } from '../types'
import { monthKey } from './format'

export const getDashboardSummary = (transactions: Transaction[], balance: number, month = monthKey(new Date().toISOString())): DashboardSummary => {
  const monthTransactions = transactions.filter((item) => monthKey(item.date) === month)
  const totalIncome = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    balance,
  }
}

export const getTopExpenseCategories = (transactions: Transaction[]) => {
  const grouped = transactions
    .filter((item) => item.type === 'expense')
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount
      return acc
    }, {})

  return Object.entries(grouped)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
}

export const getBudgetUsage = (transactions: Transaction[], budgets: Budget[], month: string) =>
  budgets
    .filter((budget) => budget.month === month)
    .map((budget) => {
      const expense = transactions
        .filter((transaction) => transaction.type === 'expense' && transaction.category === budget.category && monthKey(transaction.date) === month)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      const usedPercent = budget.limit === 0 ? 0 : (expense / budget.limit) * 100

      return {
        ...budget,
        expense,
        usedPercent,
        status: usedPercent > 100 ? 'danger' : usedPercent > 80 ? 'warning' : 'safe',
      }
    })
