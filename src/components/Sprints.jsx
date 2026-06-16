import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import ConfirmModal from './ConfirmModal'
import DateInput from './DateInput'
import { formatDateFull, formatDateShort } from '../utils/dateFormat'

export default function Sprints() {
  const { board, addSprint, updateSprint, deleteSprint, startSprint, completeSprint, getSprintPoints, moveBacklogToSprint } = useBoard()
  const { currentUser } = useAuth()
  const { t, language } = useTranslation()
  const isAdmin = currentUser?.role === 'admin'
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', goal: '', startDate: '', endDate: '' })

  function resetForm() {
    setForm({ name: '', goal: '', startDate: '', endDate: '' })
    setEditing(null)
    setShowForm(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editing) {
      updateSprint(editing.id, form)
    } else {
      addSprint(form)
    }
    resetForm()
  }

  function handleEdit(sprint) {
    setForm({ name: sprint.name, goal: sprint.goal || '', startDate: sprint.startDate || '', endDate: sprint.endDate || '' })
    setEditing(sprint)
    setShowForm(true)
  }

  const activeSprint = board.sprints.find(s => s.isActive)

  return (
    <div className="sprints-page">
      <div className="backlog-header">
        <h2 className="page-title">{t('sprint.title')}</h2>
        {isAdmin && <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true) }}>{t('sprint.new')}</button>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) resetForm() }}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>{editing ? t('sprint.edit') : t('sprint.create')}</h2>
              <button className="btn-icon" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>{t('sprint.name')}</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('sprint.namePlaceholder')} autoFocus />
              </div>
              <div className="form-group">
                <label>{t('sprint.goal')}</label>
                <textarea value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} rows={2} placeholder={t('sprint.goalPlaceholder')} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('sprint.startDate')}</label>
                  <DateInput value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>{t('sprint.endDate')}</label>
                  <DateInput value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{editing ? t('sprint.update') : t('sprint.create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sprints-list">
        {board.sprints.length === 0 && (
          <div className="empty-state">{t('sprint.noneYet')}</div>
        )}

        {board.sprints.map(sprint => {
          const pts = getSprintPoints(sprint.id)
          const sprintTasks = board.columns.flatMap(c => c.tasks.filter(t => t.sprintId === sprint.id))
          const backlogItems = board.backlog.filter(t => t.sprintId === sprint.id)
          const isCurrent = sprint.isActive
          const isCompleted = !!sprint.completedAt
          const daysLeft = sprint.isActive && sprint.endDate
            ? Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))
            : null

          return (
            <div key={sprint.id} className={`sprint-card ${isCurrent ? 'sprint-active' : ''} ${isCompleted ? 'sprint-past' : ''}`}>
              <div className="sprint-card-header">
                <div className="sprint-title-section">
                  <h3>{sprint.name}</h3>
                  <div className="sprint-badges">
                    {isCurrent && <span className="badge badge-success">{t('sprint.active')}</span>}
                    {isCompleted && <span className="badge badge-muted">{t('sprint.completed')}</span>}
                    {!isCurrent && !isCompleted && <span className="badge badge-info">{t('sprint.planned')}</span>}
                    {daysLeft !== null && <span className="badge badge-warning">{t('sprint.daysLeft', { count: daysLeft })}</span>}
                  </div>
                </div>
                <div className="sprint-card-actions">
                  {isAdmin && !isCurrent && !isCompleted && (
                    <button className="btn btn-sm btn-primary" onClick={() => startSprint(sprint.id)}>{t('sprint.start')}</button>
                  )}
                  {isAdmin && isCurrent && (
                    <button className="btn btn-sm btn-danger" onClick={() => completeSprint(sprint.id)}>{t('sprint.complete')}</button>
                  )}
                  {isAdmin && !isCurrent && (
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(sprint)}>{t('sprint.editBtn')}</button>
                  )}
                  {isAdmin && <button className="btn-icon btn-icon-sm" onClick={() => setConfirmDelete(sprint)}>&times;</button>}
                </div>
              </div>

              {sprint.goal && <p className="sprint-goal">{sprint.goal}</p>}

              <div className="sprint-dates">
                <span>{sprint.startDate ? formatDateFull(sprint.startDate, language) : '—'}</span>
                <span>&rarr;</span>
                <span>{sprint.endDate ? formatDateFull(sprint.endDate, language) : '—'}</span>
              </div>

              <div className="sprint-progress">
                <div className="sprint-progress-bar">
                  <div className="sprint-progress-fill" style={{ width: pts.total > 0 ? `${(pts.done / pts.total) * 100}%` : '0%' }} />
                </div>
                <span className="sprint-progress-text">{t('sprint.ptsCompleted', { done: pts.done, total: pts.total })}</span>
              </div>

              <div className="sprint-items">
                <div className="sprint-items-section">
                  <h4>{t('sprint.onBoard', { count: sprintTasks.length })}</h4>
                  {sprintTasks.map(task => (
                    <div key={task.id} className="sprint-item">
                      <span>{task.title}</span>
                      {task.points && <span className="points-badge">{task.points} {t('backlog.pts')}</span>}
                    </div>
                  ))}
                  {sprintTasks.length === 0 && <span className="sprint-empty">{t('sprint.noTasks')}</span>}
                </div>
                <div className="sprint-items-section">
                  <h4>{t('sprint.inBacklog', { count: backlogItems.length })}</h4>
                  {backlogItems.map(item => (
                    <div key={item.id} className="sprint-item">
                      <span>{item.title}</span>
                      {isAdmin && <button className="btn btn-sm btn-secondary" onClick={() => moveBacklogToSprint(item.id, null)}>{t('sprint.unassign')}</button>}
                    </div>
                  ))}
                  {backlogItems.length === 0 && <span className="sprint-empty">{t('sprint.noBacklog')}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title={t('sprint.delete')}
          message={t('sprint.deleteConfirm', { name: confirmDelete.name })}
          onConfirm={() => { deleteSprint(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
