import { useEffect } from 'react'
import { useTranslation } from '../context/LanguageContext'

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel, danger = true }) {
  const { t } = useTranslation()

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal modal-sm" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>{t('confirm.cancel')}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel || t('confirm.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
