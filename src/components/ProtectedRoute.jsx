import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminPaths = ['/epics', '/labels', '/users']

export default function ProtectedRoute() {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) return <Navigate to="/login" replace />

  if (adminPaths.includes(location.pathname) && currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
