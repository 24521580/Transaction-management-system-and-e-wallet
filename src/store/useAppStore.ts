import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Budget, Category, Transaction, UserProfile, WalletHistoryItem } from '../types'

interface AppState {
  darkMode: boolean
  isAuthenticated: boolean
  currentBalance: number
  user: UserProfile
  transactions: Transaction[]
  walletHistory: WalletHistoryItem[]
  categories: Category[]
  budgets: Budget[]
  toggleDarkMode: () => void
  login: (email: string) => void
  logout: () => void
  register: (name: string, email: string) => void
  updateProfile: (profile: UserProfile) => void
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  addTransaction: (payload: Omit<Transaction, 'id'>) => Transaction
  updateTransaction: (payload: Transaction) => void
  removeTransaction: (id: string) => void
  applyWalletOperation: (action: WalletHistoryItem['action'], amount: number, note?: string) => void
  saveCategory: (category: Omit<Category, 'id'> & { id?: string }) => void
  deleteCategory: (id: string) => void
  saveBudget: (budget: Omit<Budget, 'id'> & { id?: string }) => void
}

const defaultTransactions: Transaction[] = [
  { id: 't1', title: 'Lương tháng 4', amount: 25000000, type: 'income', category: 'Salary', date: '2026-04-01', walletId: 'main' },
  { id: 't2', title: 'Tiền nhà', amount: 7000000, type: 'expense', category: 'Housing', date: '2026-04-02', walletId: 'main' },
  { id: 't3', title: 'Siêu thị', amount: 1450000, type: 'expense', category: 'Food', date: '2026-04-05', walletId: 'main' },
  { id: 't4', title: 'Freelance', amount: 3800000, type: 'income', category: 'Other Income', date: '2026-04-09', walletId: 'main' },
  { id: 't5', title: 'Cafe', amount: 160000, type: 'expense', category: 'Lifestyle', date: '2026-04-10', walletId: 'main' },
  { id: 't6', title: 'Chuyển sang ví phụ', amount: 1000000, type: 'transfer', category: 'Transfer', date: '2026-04-11', walletId: 'main' },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      isAuthenticated: false,
      currentBalance: 38690000,
      user: { name: 'Nguyen Van A', email: 'demo@wallet.vn', phone: '0901234567' },
      transactions: defaultTransactions,
      walletHistory: [
        { id: 'w1', action: 'deposit', amount: 5000000, balanceAfter: 35000000, date: '2026-04-01', note: 'Nạp ví ban đầu' },
        { id: 'w2', action: 'transfer', amount: 1000000, balanceAfter: 34000000, date: '2026-04-11', note: 'Chuyển ví phụ' },
      ],
      categories: [
        { id: 'c1', name: 'Salary', type: 'income' },
        { id: 'c2', name: 'Other Income', type: 'income' },
        { id: 'c3', name: 'Housing', type: 'expense' },
        { id: 'c4', name: 'Food', type: 'expense' },
        { id: 'c5', name: 'Lifestyle', type: 'expense' },
        { id: 'c6', name: 'Transport', type: 'expense' },
      ],
      budgets: [
        { id: 'b1', category: 'Food', month: '2026-04', limit: 3000000 },
        { id: 'b2', category: 'Lifestyle', month: '2026-04', limit: 1500000 },
        { id: 'b3', category: 'Transport', month: '2026-04', limit: 1200000 },
      ],
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      login: (email: string) =>
        set({ isAuthenticated: true, user: { ...get().user, email } }),
      logout: () => set({ isAuthenticated: false }),
      register: (name: string, email: string) =>
        set({ isAuthenticated: true, user: { ...get().user, name, email } }),
      updateProfile: (profile) => set({ user: profile }),
      changePassword: async () => Promise.resolve(),
      addTransaction: (payload) => {
        const created: Transaction = { ...payload, id: crypto.randomUUID() }
        set((state) => ({ transactions: [created, ...state.transactions] }))
        return created
      },
      updateTransaction: (payload) =>
        set((state) => ({ transactions: state.transactions.map((item) => (item.id === payload.id ? payload : item)) })),
      removeTransaction: (id) =>
        set((state) => ({ transactions: state.transactions.filter((item) => item.id !== id) })),
      applyWalletOperation: (action, amount, note) =>
        set((state) => {
          const updatedBalance =
            action === 'deposit' ? state.currentBalance + amount : Math.max(0, state.currentBalance - amount)
          const item: WalletHistoryItem = {
            id: crypto.randomUUID(),
            action,
            amount,
            date: new Date().toISOString(),
            balanceAfter: updatedBalance,
            note,
          }
          return { currentBalance: updatedBalance, walletHistory: [item, ...state.walletHistory] }
        }),
      saveCategory: (category) =>
        set((state) => {
          if (category.id) {
            return {
              categories: state.categories.map((item) =>
                item.id === category.id ? { id: item.id, name: category.name, type: category.type } : item,
              ),
            }
          }

          return { categories: [...state.categories, { id: crypto.randomUUID(), name: category.name, type: category.type }] }
        }),
      deleteCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((item) => item.id !== id) })),
      saveBudget: (budget) =>
        set((state) => {
          if (budget.id) {
            return {
              budgets: state.budgets.map((item) =>
                item.id === budget.id
                  ? { id: item.id, category: budget.category, month: budget.month, limit: budget.limit }
                  : item,
              ),
            }
          }

          return {
            budgets: [...state.budgets, { id: crypto.randomUUID(), category: budget.category, month: budget.month, limit: budget.limit }],
          }
        }),
    }),
    { name: 'wallet-app-store' },
  ),
)
