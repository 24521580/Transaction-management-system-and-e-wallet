import { Navigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
