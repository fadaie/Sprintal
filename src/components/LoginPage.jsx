import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBoard } from '../context/BoardContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
import LogoIcon from './LogoIcon'

export default function LoginPage() {
  const { login, currentUser } = useAuth()
  const { board } = useBoard()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useTranslation()
  const [username, setUsername] = useState('Admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { if (currentUser) navigate('/', { replace: true }) }, [currentUser, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) { setError(t('login.errorEmpty')); return }
    if (!login(username.trim(), password.trim())) setError(t('login.error'))
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoIcon size={32} />
            <h1>{t('login.title')}</h1>
          </div>
          <div className="login-actions">
            <button className="btn-icon lang-btn" onClick={toggleLanguage}>{language === 'en' ? 'FA' : 'EN'}</button>
            <button className="btn-icon theme-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          </div>
        </div>
        <p className="login-subtitle">{t('login.subtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('login.username')}</label>
            <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError('') }} placeholder={t('login.usernamePlaceholder')} autoFocus />
          </div>
          <div className="form-group">
            <label>{t('login.password')}</label>
            <div className="password-wrapper">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder={t('login.passwordPlaceholder')} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)} tabIndex={-1} aria-label="Toggle password visibility">{showPw ? '🙈' : '👁️'}</button>
            </div>
          </div>
          {error && <span className="form-error">{error}</span>}
          <button type="submit" className="btn btn-primary login-btn">{t('login.signIn')}</button>
        </form>
        <p className="login-hint">{t('login.hint')}</p>
      </div>
    </div>
  )
}
