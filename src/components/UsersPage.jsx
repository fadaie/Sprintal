import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useTranslation } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { randomColor } from '../data/seed'
import PhotoUpload from './PhotoUpload'

export default function UsersPage() {
  const { board, addUser, updateUser, deleteUser } = useBoard()
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', password: '', role: 'member', avatarUrl: null })
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', password: '', role: 'member', avatarUrl: null })
  const [showPw, setShowPw] = useState(false)
  const [showEditPw, setShowEditPw] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    addUser({
      name: form.name.trim(),
      password: form.password || 'pass123',
      role: 'member',
      avatarColor: randomColor(),
      avatarUrl: form.avatarUrl || null,
      labelAccess: [],
    })
    setForm({ name: '', password: '', role: 'member', avatarUrl: null })
  }

  function openEdit(user) {
    setEditUser(user)
    setEditForm({
      name: user.name,
      password: '',
      role: user.role || 'member',
      avatarUrl: user.avatarUrl || null,
    })
  }

  function handleEditSave(e) {
    e.preventDefault()
    if (!editForm.name.trim() || !editUser) return
    const updates = { name: editForm.name.trim(), avatarUrl: editForm.avatarUrl }
    if (editForm.password) updates.password = editForm.password
    if (currentUser?.id === editUser.id) {
      updates.role = editForm.role
    }
    updateUser(editUser.id, updates)
    setEditUser(null)
  }

  function handleEditCancel() {
    setEditUser(null)
  }

  function renderAvatar(user) {
    if (user.avatarUrl) {
      return <img src={user.avatarUrl} className="user-avatar-img" />
    }
    return user.name[0].toUpperCase()
  }

  return (
    <div className="manager-page">
      <h2 className="page-title">{t('manageUsers')}</h2>

      <form onSubmit={handleAdd} className="epic-form manager-form">
        <input type="text" placeholder={t('userNamePlaceholder')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <div className="password-wrapper">
          <input type={showPw ? 'text' : 'password'} placeholder={t('userPasswordPlaceholder')} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)} tabIndex={-1}>{showPw ? '🙈' : '👁️'}</button>
        </div>
        <div className="epic-form-row">
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="member">{t('role.member')}</option>
            <option value="admin">{t('role.admin')}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t('user.photo')}</label>
          <PhotoUpload currentUrl={form.avatarUrl} onSelect={url => setForm(f => ({ ...f, avatarUrl: url }))} />
        </div>
        <div className="manager-form-actions">
          <button type="submit" className="btn btn-primary">{t('user.add')}</button>
        </div>
      </form>

      <div className="epic-list manager-list">
        {board.users.map(user => (
          <div key={user.id} className="epic-item">
            <div className="user-avatar" style={{ background: user.avatarUrl ? 'transparent' : user.avatarColor, width: 28, height: 28 }}>
              {renderAvatar(user)}
            </div>
            <div className="epic-item-info">
              <strong>{user.name}</strong>
              <small>
                {user.role === 'admin' ? t('role.admin') : t('role.member')}
              </small>
            </div>
            <div className="epic-item-actions">
              <button className="btn btn-sm" onClick={() => openEdit(user)}>{t('sprint.editBtn')}</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}>{t('user.delete')}</button>
            </div>
          </div>
        ))}
        {board.users.length === 0 && <p className="empty-msg">{t('noUsers')}</p>}
      </div>

      {editUser && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('user.update')}</h2>
              <button className="btn-icon" onClick={handleEditCancel}>&times;</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 0' }}>
              <div className="user-avatar" style={{ background: editForm.avatarUrl ? 'transparent' : editUser.avatarColor, width: 64, height: 64, fontSize: 24, borderRadius: '50%' }}>
                {editForm.avatarUrl ? <img src={editForm.avatarUrl} className="user-avatar-img" style={{ borderRadius: '50%' }} /> : editUser.name[0].toUpperCase()}
              </div>
            </div>

            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label>{t('userNamePlaceholder')}</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('userNewPasswordPlaceholder')}</label>
                <div className="password-wrapper">
                  <input type={showEditPw ? 'text' : 'password'} value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder={t('userNewPasswordPlaceholder')} />
                  <button type="button" className="pw-toggle" onClick={() => setShowEditPw(s => !s)} tabIndex={-1}>{showEditPw ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>{t('user.photo')}</label>
                <PhotoUpload currentUrl={editForm.avatarUrl} onSelect={url => setEditForm(f => ({ ...f, avatarUrl: url }))} />
              </div>
              {editUser.id === currentUser?.id && (
                <div className="form-group">
                  <label>{t('role.admin')} / {t('role.member')}</label>
                  <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                    <option value="member">{t('role.member')}</option>
                    <option value="admin">{t('role.admin')}</option>
                  </select>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('user.update')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
