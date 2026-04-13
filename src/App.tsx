import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/common/AppShell'
import { PageWrapper } from './components/common/PageWrapper'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { CategoriesBudgetsPage } from './pages/CategoriesBudgetsPage'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReportsPage } from './pages/ReportsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { WalletPage } from './pages/WalletPage'
import { useAppStore } from './store/useAppStore'

function App() {
  const location = useLocation()
  const darkMode = useAppStore((state) => state.darkMode)

  return (
    <div className={darkMode ? 'dark bg-slate-900 text-slate-100' : ''}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="transactions" element={<PageWrapper><TransactionsPage /></PageWrapper>} />
            <Route path="wallet" element={<PageWrapper><WalletPage /></PageWrapper>} />
            <Route path="categories-budgets" element={<PageWrapper><CategoriesBudgetsPage /></PageWrapper>} />
            <Route path="reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
            <Route path="settings" element={<PageWrapper><ProfileSettingsPage /></PageWrapper>} />
          </Route>

          <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
