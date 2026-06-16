import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useTranslation } from '../context/LanguageContext'
import { randomColor } from '../data/seed'

export default function EpicsPage() {
  const { board, addEpic, updateEpic, deleteEpic } = useBoard()
  const { t } = useTranslation()
  const [form, setForm] = useState({ title: '', description: '' })
  const [editEpic, setEditEpic] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    addEpic({ title: form.title.trim(), description: form.description.trim(), color: randomColor() })
    setForm({ title: '', description: '' })
  }

  function openEdit(epic) {
    setEditEpic(epic)
    setEditForm({ title: epic.title, description: epic.description })
  }

  function handleEditSave(e) {
    e.preventDefault()
    if (!editForm.title.trim() || !editEpic) return
    updateEpic(editEpic.id, { title: editForm.title.trim(), description: editForm.description.trim() })
    setEditEpic(null)
  }

  function handleEditCancel() {
    setEditEpic(null)
  }

  return (
    <div className="manager-page">
      <h2 className="page-title">{t('manageEpics')}</h2>

      <form onSubmit={handleAdd} className="epic-form manager-form">
        <input type="text" placeholder={t('epicNamePlaceholder')} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder={t('epicDescriptionPlaceholder')} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="manager-form-actions">
          <button type="submit" className="btn btn-primary">{t('epic.add')}</button>
        </div>
      </form>

      <div className="epic-list manager-list">
        {board.epics.map(epic => (
          <div key={epic.id} className="epic-item">
            <span className="epic-dot" style={{ background: epic.color }} />
            <div className="epic-item-info">
              <strong>{epic.title}</strong>
              {epic.description && <small>{epic.description}</small>}
            </div>
            <div className="epic-item-actions">
              <button className="btn btn-sm" onClick={() => openEdit(epic)}>{t('sprint.editBtn')}</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteEpic(epic.id)}>{t('epic.delete')}</button>
            </div>
          </div>
        ))}
        {board.epics.length === 0 && <p className="empty-msg">{t('noEpics')}</p>}
      </div>

      {editEpic && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('epic.edit')}</h2>
              <button className="btn-icon" onClick={handleEditCancel}>&times;</button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label>{t('epicNamePlaceholder')}</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('epicDescriptionPlaceholder')}</label>
                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('epic.update')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
