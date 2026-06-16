import { Routes, Route, useOutletContext } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { BoardProvider } from './context/BoardContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Board from './components/Board'
import Backlog from './components/Backlog'
import Sprints from './components/Sprints'
import MeetingsPage from './components/MeetingsPage'
import ActivityLogPage from './components/ActivityLogPage'
import Dashboard from './components/Dashboard'
import EpicsPage from './components/EpicsPage'
import LabelsPage from './components/LabelsPage'
import UsersPage from './components/UsersPage'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

function DashboardPage() {
  return <Dashboard />
}

function BoardPage() {
  const { activeSprint } = useOutletContext()
  return <Board sprintFilter={activeSprint?.id} />
}

function BacklogPage() {
  return <Backlog />
}

function SprintsPage() {
  return <Sprints />
}

function MeetingsRoute() {
  return <MeetingsPage />
}

function ActivityLogRoute() {
  return <ActivityLogPage />
}

export default function App() {
  return (
    <ThemeProvider>
      <BoardProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/backlog" element={<BacklogPage />} />
                <Route path="/sprints" element={<SprintsPage />} />
                <Route path="/meetings" element={<MeetingsRoute />} />
                <Route path="/activity" element={<ActivityLogRoute />} />
                <Route path="/epics" element={<EpicsPage />} />
                <Route path="/labels" element={<LabelsPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BoardProvider>
    </ThemeProvider>
  )
}
