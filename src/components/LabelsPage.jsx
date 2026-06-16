import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useTranslation } from '../context/LanguageContext'
import { randomColor } from '../data/seed'

export default function LabelsPage() {
  const { board, addLabel, updateLabel, deleteLabel } = useBoard()
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '' })
  const [editLabel, setEditLabel] = useState(null)
  const [editForm, setEditForm] = useState({ name: '' })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (board.labels.some(l => l.name === form.name.trim())) return
    addLabel({ name: form.name.trim(), color: randomColor() })
    setForm({ name: '' })
  }

  function openEdit(label) {
    setEditLabel(label)
    setEditForm({ name: label.name })
  }

  function handleEditSave(e) {
    e.preventDefault()
    if (!editForm.name.trim() || !editLabel) return
    if (board.labels.some(l => l.name === editForm.name.trim() && l.id !== editLabel.id)) return
    updateLabel(editLabel.id, { name: editForm.name.trim() })
    setEditLabel(null)
  }

  function handleEditCancel() {
    setEditLabel(null)
  }

  return (
    <div className="manager-page">
      <h2 className="page-title">{t('manageLabels')}</h2>

      <form onSubmit={handleAdd} className="epic-form manager-form">
        <input type="text" placeholder={t('labelNamePlaceholder')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <div className="manager-form-actions">
          <button type="submit" className="btn btn-primary">{t('label.add')}</button>
        </div>
      </form>

      <div className="epic-list manager-list">
        {board.labels.map(label => (
          <div key={label.id} className="epic-item">
            <span className="epic-dot" style={{ background: label.color }} />
            <div className="epic-item-info">
              <strong>{label.name}</strong>
            </div>
            <div className="epic-item-actions">
              <button className="btn btn-sm" onClick={() => openEdit(label)}>{t('sprint.editBtn')}</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteLabel(label.id)}>{t('label.delete')}</button>
            </div>
          </div>
        ))}
        {board.labels.length === 0 && <p className="empty-msg">{t('noLabels')}</p>}
      </div>

      {editLabel && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('label.edit')}</h2>
              <button className="btn-icon" onClick={handleEditCancel}>&times;</button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label>{t('labelNamePlaceholder')}</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('label.update')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
