import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import ConfirmModal from './ConfirmModal'

export default function Header({ showSprintPicker }) {
  const { theme, toggleTheme } = useTheme()
  const { board, resetBoard, exportBoard } = useBoard()
  const { currentUser, logout } = useAuth()
  const { language, toggleLanguage, t } = useTranslation()
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const activeSprint = board.sprints.find(s => s.isActive)
  const isAdmin = currentUser?.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        {showSprintPicker && activeSprint && (
          <div className="header-sprint-indicator">
            <span className="sprint-dot" />{activeSprint.name}
          </div>
        )}
      </div>
      <div className="header-right">
        {currentUser && (
          <div className="header-user" title={currentUser.role}>
            <div className="user-avatar" style={{ background: currentUser.avatarUrl ? 'transparent' : currentUser.avatarColor }}>{currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="user-avatar-img" /> : currentUser.name[0].toUpperCase()}</div>
            <span className="header-user-name">{currentUser.name}</span>
            {isAdmin && <span className="badge badge-info">Admin</span>}
          </div>
        )}
        {isAdmin && <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirm(true)}>
          {t('header.reset')}
        </button>}
        <button className="btn btn-secondary btn-sm" onClick={exportBoard}>
          {t('export.download')}
        </button>
        <button className="btn btn-secondary btn-sm btn-danger" onClick={handleLogout}>
          {t('header.logout')}
        </button>
        <button className="btn btn-secondary btn-sm lang-btn" onClick={toggleLanguage} aria-label="Toggle language" title={language === 'en' ? 'فارسی' : 'English'}>
          {language === 'en' ? 'FA' : 'EN'}
        </button>
        <button className="btn btn-secondary btn-sm theme-btn" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          title={t('header.resetBoard')}
          message={t('header.resetConfirm')}
          onConfirm={() => { resetBoard(); setShowConfirm(false) }}
          onCancel={() => setShowConfirm(false)}
          confirmLabel={t('confirm.reset')}
          danger={true}
        />
      )}
    </header>
  )
}
