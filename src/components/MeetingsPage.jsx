import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import DateInput from './DateInput'
import TimeInput from './TimeInput'
import { formatDateFull, getTodayISO } from '../utils/dateFormat'

export default function MeetingsPage() {
  const { board, addMeeting, updateMeeting, deleteMeeting } = useBoard()
  const { currentUser } = useAuth()
  const { t, language } = useTranslation()
  const isAdmin = currentUser?.role === 'admin'
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', time: '', description: '' })
  const [minutesEdit, setMinutesEdit] = useState(null)
  const [minutesText, setMinutesText] = useState('')

  function resetForm() {
    setForm({ title: '', date: '', time: '', description: '' })
    setEditing(null)
    setShowForm(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      updateMeeting(editing.id, form)
    } else {
      addMeeting(form)
    }
    resetForm()
  }

  function handleEdit(meeting) {
    setForm({ title: meeting.title, date: meeting.date || '', time: meeting.time || '', description: meeting.description || '' })
    setEditing(meeting)
    setShowForm(true)
  }

  function handleSaveMinutes(id) {
    updateMeeting(id, { minutes: minutesText })
    setMinutesEdit(null)
    setMinutesText('')
  }

  return (
    <div className="meetings-page">
      <div className="backlog-header">
        <h2 className="page-title">{t('nav.meetings')}</h2>
        {isAdmin && <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true) }}>{t('meeting.add')}</button>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) resetForm() }}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>{editing ? t('meeting.edit') : t('meeting.create')}</h2>
              <button className="btn-icon" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>{t('meeting.title')}</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t('meeting.titlePlaceholder')} autoFocus />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('meeting.date')}</label>
                  <DateInput value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>{t('meeting.time')}</label>
                  <TimeInput value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>{t('meeting.description')}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t('meeting.descriptionPlaceholder')} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('confirm.cancel')}</button>
                <button type="submit" className="btn btn-primary">{editing ? t('meeting.update') : t('meeting.create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {board.meetings.length === 0 && (
        <div className="empty-state">{t('meeting.noMeetings')}</div>
      )}

      <div className="meetings-list">
        {board.meetings.map(meeting => {
          const hasMinutes = !!meeting.minutes
          const today = getTodayISO()
          const isPast = meeting.date && meeting.date < today
          return (
            <div key={meeting.id} className={`meeting-card ${hasMinutes ? 'meeting-done' : ''}`}>
              <div className="meeting-card-header">
                <div className="meeting-title-section">
                  <h3>{meeting.title}</h3>
                  <span className={`badge ${hasMinutes ? 'badge-success' : 'badge-warning'}`}>
                    {hasMinutes ? t('meeting.held') : t('meeting.upcoming')}
                  </span>
                </div>
                {isAdmin && <div className="meeting-card-actions">
                  {!hasMinutes && <button className="btn btn-sm btn-secondary" onClick={() => { setMinutesEdit(meeting.id); setMinutesText('') }}>{t('meeting.addMinutes')}</button>}
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(meeting)}>{t('sprint.editBtn')}</button>
                  <button className="btn-icon btn-icon-sm" onClick={() => deleteMeeting(meeting.id)}>&times;</button>
                </div>}
              </div>

              {meeting.date && (
                <div className="meeting-datetime">
                  <span>{language === 'fa' ? formatDateFull(meeting.date, 'fa') : formatDateFull(meeting.date, language)}</span>
                  {meeting.time && <span>{meeting.time}</span>}
                </div>
              )}

              {meeting.description && <p className="meeting-desc">{meeting.description}</p>}

              {minutesEdit === meeting.id && (
                <div className="meeting-minutes-edit">
                  <textarea value={minutesText} onChange={e => setMinutesText(e.target.value)} placeholder={t('meeting.minutesPlaceholder')} rows={4} />
                  <div className="meeting-minutes-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => setMinutesEdit(null)}>{t('confirm.cancel')}</button>
                    <button className="btn btn-sm btn-primary" onClick={() => handleSaveMinutes(meeting.id)}>{t('meeting.saveMinutes')}</button>
                  </div>
                </div>
              )}

              {hasMinutes && minutesEdit !== meeting.id && (
                <div className="meeting-minutes">
                  <h4>{t('meeting.minutes')}</h4>
                  <p>{meeting.minutes}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
