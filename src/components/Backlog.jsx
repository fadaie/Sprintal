import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import { priorityColors, pointsOptions } from '../data/seed'


export default function Backlog() {
  const { board, addBacklogItem, updateBacklogItem, deleteBacklogItem, moveBacklogToSprint, moveBacklogToColumn, getLabelColor, getUserById } = useBoard()
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [filterEpic, setFilterEpic] = useState('all')
  const [filterSprint, setFilterSprint] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', points: 3, epicId: '', labels: [], assignee: '' })

  const isAdmin = currentUser?.role === 'admin'

  const filtered = board.backlog.filter(t => {
    if (filterEpic !== 'all' && t.epicId !== filterEpic) return false
    if (filterSprint === 'unassigned' && t.sprintId) return false
    if (filterSprint !== 'all' && filterSprint !== 'unassigned' && t.sprintId !== filterSprint) return false
    if (filterAssignee === '_unassigned' && t.assignee) return false
    if (filterAssignee !== 'all' && filterAssignee !== '_unassigned' && t.assignee !== filterAssignee) return false
    return true
  })

  function resetForm() {
    setForm({ title: '', description: '', priority: 'medium', points: 3, epicId: '', labels: [], assignee: '' })
    setEditing(null)
    setShowForm(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      updateBacklogItem(editing.id, form)
    } else {
      addBacklogItem(form)
    }
    resetForm()
  }

  function handleEdit(item) {
    setForm({ title: item.title, description: item.description || '', priority: item.priority, points: item.points || 3, epicId: item.epicId || '', labels: item.labels || [], assignee: item.assignee || '' })
    setEditing(item)
    setShowForm(true)
  }

  function toggleLabel(label) {
    setForm(f => ({ ...f, labels: f.labels.includes(label) ? f.labels.filter(l => l !== label) : [...f.labels, label] }))
  }

  const totalPoints = board.backlog.reduce((s, t) => s + (t.points || 0), 0)
  const unassigned = board.backlog.filter(t => !t.sprintId)

  return (
    <div className="backlog-page">
      <div className="backlog-header">
        <h2 className="page-title">{t('backlog.title')}</h2>
        <div className="backlog-stats">
          <span className="stat-chip">{board.backlog.length} {t('backlog.items')}</span>
          <span className="stat-chip">{totalPoints} {t('backlog.pts')}</span>
          <span className="stat-chip">{unassigned.length} {t('backlog.unassigned')}</span>
        </div>
      </div>

      <div className="backlog-toolbar">
        <div className="backlog-filters">
          <select value={filterEpic} onChange={e => setFilterEpic(e.target.value)}>
            <option value="all">{t('backlog.allEpics')}</option>
            {board.epics.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <select value={filterSprint} onChange={e => setFilterSprint(e.target.value)}>
            <option value="all">{t('backlog.allSprints')}</option>
            <option value="unassigned">{t('backlog.unassignedFilter')}</option>
            {board.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
            <option value="all">{t('board.allAssignees')}</option>
            <option value="_unassigned">{t('board.unassigned')}</option>
            {board.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        {isAdmin && <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true) }}>{t('backlog.addStory')}</button>}
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) resetForm() }}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>{editing ? t('backlog.editStory') : t('backlog.newStory')}</h2>
              <button className="btn-icon" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>{t('task.title')}</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t('backlog.asAUser')} autoFocus />
              </div>
              <div className="form-group">
                <label>{t('task.description')}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('task.priority')}</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{t('priority.' + p)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('task.storyPoints')}</label>
                  <select value={form.points} onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))}>
                    {pointsOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>{t('task.epic')}</label>
                <select value={form.epicId} onChange={e => setForm(f => ({ ...f, epicId: e.target.value }))}>
                  <option value="">{t('task.noEpic')}</option>
                  {board.epics.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('task.assignee')}</label>
                <select value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                  <option value="">{t('task.noAssignee')}</option>
                  {board.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('task.labels')}</label>
                <div className="label-picker">
                  {board.labels.map(label => (
                    <button key={label.id} type="button" className={`label-chip ${form.labels.includes(label.name) ? 'active' : ''}`} style={form.labels.includes(label.name) ? { background: label.color + '30', borderColor: label.color, color: label.color } : {}} onClick={() => toggleLabel(label.name)}>{label.name}</button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{editing ? t('sprint.editBtn') : t('backlog.addToBacklog')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="backlog-list">
        {filtered.map(item => {
          const epic = board.epics.find(e => e.id === item.epicId)
          const priority = priorityColors[item.priority]
          const sprint = item.sprintId ? board.sprints.find(s => s.id === item.sprintId) : null
          const assigneeUser = item.assignee ? getUserById(item.assignee) : null
          return (
            <div key={item.id} className="backlog-item">
              <div className="backlog-item-main" onClick={() => isAdmin && handleEdit(item)}>
                <div className="backlog-item-top">
                  <span className="task-priority" style={{ background: priority?.bg, color: priority?.text }}>{t('priority.' + item.priority)}</span>
                  {item.points && <span className="points-badge">{item.points} {t('backlog.pts')}</span>}
                  {epic && <span className="epic-badge" style={{ background: epic.color + '20', color: epic.color }}>{epic.title}</span>}
                  {sprint && <span className="sprint-badge">{sprint.name}</span>}
                </div>
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
                <div className="task-labels">
                  {item.labels?.map(l => <span key={l} className="task-label" style={{ background: getLabelColor(l) + '20', color: getLabelColor(l) }}>{l}</span>)}
                </div>
                {assigneeUser && <div className="user-avatar user-avatar-xs" style={{ background: assigneeUser.avatarUrl ? 'transparent' : assigneeUser.avatarColor }} title={assigneeUser.name}>{assigneeUser.avatarUrl ? <img src={assigneeUser.avatarUrl} className="user-avatar-img" /> : assigneeUser.name[0].toUpperCase()}</div>}
              </div>
              {isAdmin && <div className="backlog-item-actions">
                <select
                  value={item.sprintId || ''}
                  onChange={e => moveBacklogToSprint(item.id, e.target.value || null)}
                  onClick={e => e.stopPropagation()}
                >
                  <option value="">{t('backlog.noSprint')}</option>
                  {board.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); moveBacklogToColumn(item.id, 'todo') }}>
                  {t('task.start')}
                </button>
                <button className="btn-icon btn-icon-sm" onClick={e => { e.stopPropagation(); deleteBacklogItem(item.id) }}>&times;</button>
              </div>}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="empty-state">{t('backlog.noMatch')}</div>}
      </div>
    </div>
  )
}
