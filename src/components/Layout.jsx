import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { board } = useBoard()
  const { currentUser } = useAuth()
  const location = useLocation()

  const activeSprint = board.sprints.find(s => s.isActive)
  const isBoardPage = location.pathname === '/board'

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(s => !s)}
      />
      <div className="main-area">
        <Header showSprintPicker={isBoardPage} />
        <main className="main-content">
          <Outlet context={{ activeSprint, currentUser }} />
        </main>
      </div>
    </div>
  )
}
