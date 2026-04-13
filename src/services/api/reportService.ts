import { useAppStore } from '../../store/useAppStore'
import { apiClient } from './apiClient'
import { mockAdapter } from './mockAdapter'

export const reportService = {
  async exportCsv() {
    const { transactions } = useAppStore.getState()
    const header = 'id,title,amount,type,category,date,note,walletId'
    const rows = transactions.map((transaction) =>
      [transaction.id, transaction.title, transaction.amount, transaction.type, transaction.category, transaction.date, transaction.note ?? '', transaction.walletId].join(','),
    )
    const csv = [header, ...rows].join('\n')
    const response = await apiClient.get('/reports/csv', { adapter: mockAdapter({ csv }) })
    return response.data.csv as string
  },
}
