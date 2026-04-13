import { useAppStore } from '../../store/useAppStore'
import type { WalletHistoryItem } from '../../types'
import { apiClient } from './apiClient'
import { mockAdapter } from './mockAdapter'

export const walletService = {
  async operate(action: WalletHistoryItem['action'], amount: number, note?: string) {
    useAppStore.getState().applyWalletOperation(action, amount, note)
    const response = await apiClient.post('/wallet/operation', { action, amount, note }, { adapter: mockAdapter({ success: true }) })
    return response.data
  },
}
