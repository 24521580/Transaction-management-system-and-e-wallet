export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
  note?: string
  walletId: string
}

export interface WalletHistoryItem {
  id: string
  action: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  date: string
  balanceAfter: number
  note?: string
}

export interface Category {
  id: string
  name: string
  type: Exclude<TransactionType, 'transfer'>
}

export interface Budget {
  id: string
  category: string
  month: string
  limit: number
}

export interface UserProfile {
  name: string
  email: string
  phone: string
}

export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  net: number
  balance: number
}

export interface TransactionFilters {
  query: string
  type: '' | TransactionType
  category: string
  minAmount: string
  maxAmount: string
  fromDate: string
  toDate: string
}
