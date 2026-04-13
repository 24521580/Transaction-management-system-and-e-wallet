import { useAppStore } from '../../store/useAppStore'
import type { Transaction, TransactionFilters } from '../../types'
import { apiClient } from './apiClient'
import { mockAdapter } from './mockAdapter'

const applyFilters = (items: Transaction[], filters: TransactionFilters) =>
  items.filter((item) => {
    const text = `${item.title} ${item.note ?? ''}`.toLowerCase()
    const matchesQuery = !filters.query || text.includes(filters.query.toLowerCase())
    const matchesType = !filters.type || item.type === filters.type
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesMin = !filters.minAmount || item.amount >= Number(filters.minAmount)
    const matchesMax = !filters.maxAmount || item.amount <= Number(filters.maxAmount)
    const matchesFrom = !filters.fromDate || new Date(item.date) >= new Date(filters.fromDate)
    const matchesTo = !filters.toDate || new Date(item.date) <= new Date(filters.toDate)

    return matchesQuery && matchesType && matchesCategory && matchesMin && matchesMax && matchesFrom && matchesTo
  })

export const transactionService = {
  async list(filters: TransactionFilters, page: number, perPage: number) {
    const state = useAppStore.getState()
    const filtered = applyFilters(state.transactions, filters)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    const response = await apiClient.get('/transactions', {
      adapter: mockAdapter({ data: paginated, total: filtered.length }),
    })

    return response.data as { data: Transaction[]; total: number }
  },
  async create(payload: Omit<Transaction, 'id'>) {
    const created = useAppStore.getState().addTransaction(payload)
    const response = await apiClient.post('/transactions', created, { adapter: mockAdapter(created) })
    return response.data as Transaction
  },
  async update(payload: Transaction) {
    useAppStore.getState().updateTransaction(payload)
    const response = await apiClient.put(`/transactions/${payload.id}`, payload, { adapter: mockAdapter(payload) })
    return response.data as Transaction
  },
  async remove(id: string) {
    useAppStore.getState().removeTransaction(id)
    const response = await apiClient.delete(`/transactions/${id}`, { adapter: mockAdapter({ success: true }) })
    return response.data as { success: boolean }
  },
}
