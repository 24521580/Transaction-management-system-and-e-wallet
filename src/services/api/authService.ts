import { apiClient } from './apiClient'
import { mockAdapter } from './mockAdapter'
import { useAppStore } from '../../store/useAppStore'

export const authService = {
  async login(email: string, password: string) {
    const state = useAppStore.getState()
    state.login(email)
    const response = await apiClient.post('/auth/login', { email, password }, { adapter: mockAdapter({ token: 'demo-token' }) })
    return response.data
  },
  async register(name: string, email: string, password: string) {
    const state = useAppStore.getState()
    state.register(name, email)
    const response = await apiClient.post('/auth/register', { name, email, password }, { adapter: mockAdapter({ success: true }) })
    return response.data
  },
  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email }, { adapter: mockAdapter({ sent: true }) })
    return response.data
  },
}
