import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAppStore } from '../../store/useAppStore'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/transactions', label: 'Transactions' },
  { to: '/app/wallet', label: 'Wallet' },
  { to: '/app/categories-budgets', label: 'Categories/Budgets' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/settings', label: 'Settings' },
]

export function AppShell() {
  const { user, logout, darkMode, toggleDarkMode } = useAppStore((state) => ({
    user: state.user,
    logout: state.logout,
    darkMode: state.darkMode,
    toggleDarkMode: state.toggleDarkMode,
  }))

  return (
    <div className="min-h-screen bg-background text-slate-800">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-background/80 backdrop-blur-lg">
        <div className="page-container flex items-center justify-between gap-4 py-3">
          <Link to="/app/dashboard" className="text-lg font-bold text-primary">
            WalletOS
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-white/60'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="h-9 px-3" onClick={toggleDarkMode} aria-label="Bật tắt dark mode">
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <span className="hidden text-sm text-slate-500 md:inline">{user.name}</span>
            <Button className="h-9 px-4" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex overflow-x-auto border-t border-white/60 bg-background/90 px-2 py-2 backdrop-blur lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 rounded-full px-2 py-2 text-center text-xs ${isActive ? 'bg-primary text-white' : 'text-slate-600'}`
            }
          >
            {item.label.replace('/Budgets', '')}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
