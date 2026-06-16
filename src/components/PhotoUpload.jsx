import { useRef } from 'react'
import { useTranslation } from '../context/LanguageContext'

export default function PhotoUpload({ currentUrl, onSelect }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  function handleClick() {
    inputRef.current?.click()
  }

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onSelect(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="photo-upload">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} />
      <button type="button" className="btn btn-secondary btn-photo" onClick={handleClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
        {t('user.choosePhoto')}
      </button>
      {currentUrl && (
        <div className="photo-upload-preview">
          <img src={currentUrl} alt="" />
          <button type="button" className="photo-upload-clear" onClick={() => onSelect(null)} title="Remove">&times;</button>
        </div>
      )}
    </div>
  )
}
