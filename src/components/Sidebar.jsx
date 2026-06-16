import { NavLink } from 'react-router-dom'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import LogoIcon from './LogoIcon'

const Svg = ({ children }) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>

const icons = {
  dashboard: <Svg><rect x="2" y="2" width="7" height="7" rx="1.3" /><rect x="11" y="2" width="7" height="7" rx="1.3" /><rect x="2" y="11" width="7" height="7" rx="1.3" /><rect x="11" y="11" width="7" height="7" rx="1.3" /></Svg>,
  board: <Svg><rect x="2" y="1.5" width="4.2" height="17" rx="1.2" /><rect x="7.9" y="4" width="4.2" height="14.5" rx="1.2" /><rect x="13.8" y="1.5" width="4.2" height="17" rx="1.2" /></Svg>,
  backlog: <Svg><rect x="2" y="1.5" width="16" height="3.2" rx="1" /><rect x="2" y="8.4" width="16" height="3.2" rx="1" /><rect x="2" y="15.3" width="10" height="3.2" rx="1" /></Svg>,
  sprints: <Svg><line x1="3.5" y1="1.5" x2="3.5" y2="18.5" /><polyline points="3.5,3 17,3 15,7.5 17,12 3.5,12" /></Svg>,
  meetings: <Svg><rect x="2" y="3" width="16" height="15" rx="2" /><line x1="2" y1="8" x2="18" y2="8" /><line x1="6" y1="1" x2="6" y2="5" /><line x1="14" y1="1" x2="14" y2="5" /></Svg>,
  epics: <Svg><polygon points="10,1.5 17.5,6 10,10.5 2.5,6" /><polygon points="10,9.5 17.5,14 10,18.5 2.5,14" /></Svg>,
  labels: <Svg><path d="M2.5 9.5V2.5h7l8 8-7 7-8-8z" /><circle cx="6.5" cy="6.5" r="1.1" /></Svg>,
  users: <Svg><path d="M6.5 10.5A3.5 3.5 0 1 0 6.5 3.5a3.5 3.5 0 0 0 0 7z" /><path d="M1 18.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" /><path d="M13.5 4.2A2.5 2.5 0 1 1 13.5 9" /><path d="M14 11.5c2 0 3.8 1.5 3.8 3.8v3.2" /></Svg>,
  activityLog: <Svg><polyline points="2.5,8 2.5,3 8,3" /><polyline points="18.5,12 18.5,17.5 13,17.5" /><path d="M2.5,3 L10,10.5" /><circle cx="14.5" cy="6.5" r="4" /><line x1="14.5" y1="4.5" x2="14.5" y2="8.5" /><line x1="12.5" y1="6.5" x2="16.5" y2="6.5" /></Svg>,
}

const mainNavItems = [
  { to: '/', labelKey: 'nav.dashboard', icon: icons.dashboard, exact: true },
  { to: '/board', labelKey: 'nav.board', icon: icons.board, exact: false },
  { to: '/backlog', labelKey: 'nav.backlog', icon: icons.backlog, exact: false },
  { to: '/sprints', labelKey: 'nav.sprints', icon: icons.sprints, exact: false },
  { to: '/meetings', labelKey: 'nav.meetings', icon: icons.meetings, exact: false },
  { to: '/activity', labelKey: 'nav.activityLog', icon: icons.activityLog, exact: false },
]

const adminNavItems = [
  { to: '/epics', labelKey: 'nav.epics', icon: icons.epics, exact: false },
  { to: '/labels', labelKey: 'nav.labels', icon: icons.labels, exact: false },
  { to: '/users', labelKey: 'nav.users', icon: icons.users, exact: false },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { board } = useBoard()
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const isAdmin = currentUser?.role === 'admin'
  const activeSprint = board.sprints.find(s => s.isActive)
  const unheldCount = board.meetings.filter(m => !m.minutes).length

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {collapsed ? <LogoIcon size={22} /> : <><LogoIcon size={24} /><span className="sidebar-logo">{t('login.title')}</span></>}
        <button className="btn-icon" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? '▸' : '◂'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {mainNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">
              {item.icon}
              {item.to === '/meetings' && unheldCount > 0 && <span className="badge badge-count">{unheldCount}</span>}
            </span>
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}
        {isAdmin && <div className="sidebar-divider" />}
        {isAdmin && adminNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}
      </nav>
      {!collapsed && activeSprint && (
        <div className="sidebar-sprint-info">
          <span className="sidebar-sprint-label">{t('sidebar.activeSprint')}</span>
          <span className="sidebar-sprint-name">{activeSprint.name}</span>
        </div>
      )}
    </aside>
  )
}
