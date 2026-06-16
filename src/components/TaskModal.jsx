import { useState, useEffect } from 'react'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import { pointsOptions } from '../data/seed'
import DateInput from './DateInput'

const priorities = ['low', 'medium', 'high']

export default function TaskModal({ task, columnId, onSave, onClose }) {
  const { board, updateTask } = useBoard()
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [labels, setLabels] = useState([])
  const [points, setPoints] = useState(0)
  const [epicId, setEpicId] = useState('')
  const [sprintId, setSprintId] = useState('')
  const [assignee, setAssignee] = useState('')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')

  const comments = task?.comments || []

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      setDueDate(task.dueDate || '')
      setLabels(task.labels || [])
      setPoints(task.points || 0)
      setEpicId(task.epicId || '')
      setSprintId(task.sprintId || '')
      setAssignee(task.assignee || '')
      setAcceptanceCriteria(task.acceptanceCriteria || '')
    }
  }, [task])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) { setError(t('task.titleRequired')); return }
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority, dueDate, labels,
      points: points || undefined,
      epicId: epicId || undefined,
      sprintId: sprintId || undefined,
      assignee: assignee || null,
      acceptanceCriteria: acceptanceCriteria.trim(),
    })
  }

  function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim() || !task) return
    updateTask(columnId, task.id, {
      comments: [...comments, { id: Date.now(), text: commentText.trim(), author: currentUser?.name || 'Unknown', createdAt: Date.now() }]
    })
    setCommentText('')
  }

  const toggleLabel = (label) => {
    setLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{task ? t('task.edit') : t('task.new')}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">{t('task.title')}</label>
            <input id="task-title" type="text" value={title} onChange={e => { setTitle(e.target.value); setError('') }} placeholder={t('task.titlePlaceholder')} autoFocus />
            {error && <span className="form-error">{error}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="task-desc">{t('task.description')}</label>
            <textarea id="task-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder={t('task.descriptionPlaceholder')} rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="task-accept">{t('task.acceptanceCriteria')}</label>
            <textarea id="task-accept" value={acceptanceCriteria} onChange={e => setAcceptanceCriteria(e.target.value)} placeholder={t('task.acceptancePlaceholder')} rows={2} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">{t('task.priority')}</label>
              <select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)}>
                {priorities.map(p => <option key={p} value={p}>{t('priority.' + p)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task-due">{t('task.dueDate')}</label>
              <DateInput id="task-due" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('task.storyPoints')}</label>
              <select value={points} onChange={e => setPoints(Number(e.target.value))}>
                <option value={0}>—</option>
                {pointsOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('task.epic')}</label>
              <select value={epicId} onChange={e => setEpicId(e.target.value)}>
                <option value="">{t('task.noEpic')}</option>
                {board.epics.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('task.sprint')}</label>
            <select value={sprintId} onChange={e => setSprintId(e.target.value)}>
              <option value="">{t('task.noSprint')}</option>
              {board.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('task.assignee')}</label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)}>
              <option value="">{t('task.noAssignee')}</option>
              {board.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('task.labels')}</label>
            <div className="label-picker">
              {board.labels.map(label => (
                <button key={label.id} type="button" className={`label-chip ${labels.includes(label.name) ? 'active' : ''}`} style={labels.includes(label.name) ? { background: label.color + '30', borderColor: label.color, color: label.color } : {}} onClick={() => toggleLabel(label.name)}>{label.name}</button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t('confirm.cancel')}</button>
            <button type="submit" className="btn btn-primary">{task ? t('task.save') : t('task.create')}</button>
          </div>
        </form>

        {task && (
          <div className="modal-section">
            <h4 className="modal-section-title">{t('comments.title')}</h4>
            {comments.length === 0 && <p className="empty-msg">{t('comments.empty')}</p>}
            <div className="comment-list">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <strong className="comment-author">{c.author}</strong>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))}
            </div>
            <form className="comment-form" onSubmit={handleAddComment}>
              <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t('comments.placeholder')} />
              <button type="submit" className="btn btn-primary btn-sm">{t('comments.add')}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
