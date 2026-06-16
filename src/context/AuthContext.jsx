import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useBoard } from './BoardContext'

const AUTH_KEY = 'flowboard-auth-v2'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { board } = useBoard()
  const boardRef = useRef(board)
  boardRef.current = board
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    localStorage.removeItem('flowboard-auth-user')
    try {
      const saved = localStorage.getItem(AUTH_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (!parsed?.id) return
      const exists = board.users?.find(u => u.id === parsed.id)
      if (exists) setCurrentUser(exists)
    } catch {}
  }, [])

  function login(username, password) {
    function doLogin(from) {
      const user = from.find(u => u.name === username && u.password === password)
      if (!user) return false
      const info = { id: user.id, name: user.name, role: user.role, labelAccess: user.labelAccess, avatarColor: user.avatarColor, avatarUrl: user.avatarUrl }
      setCurrentUser(info)
      localStorage.setItem(AUTH_KEY, JSON.stringify(info))
      return true
    }
    const b = boardRef.current
    if (b?.users && doLogin(b.users)) return true
    try {
      const raw = localStorage.getItem('flowboard-data-v2')
      if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed?.users) && doLogin(parsed.users)) return true }
    } catch {}
    return false
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
