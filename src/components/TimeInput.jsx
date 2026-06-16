import { useTranslation } from '../context/LanguageContext'

export default function TimeInput({ value, onChange, ...props }) {
  const { language } = useTranslation()

  let hour = '00', minute = '00'
  if (value) {
    const parts = value.split(':')
    if (parts.length === 2) { hour = parts[0]; minute = parts[1] }
  }
  function handleChange(field, val) {
    const h = field === 'hour' ? val : hour
    const m = field === 'minute' ? val : minute
    onChange({ target: { value: `${h}:${m}` } })
  }
  return (
    <div className="time-picker" dir="ltr">
      <select value={hour} onChange={e => handleChange('hour', e.target.value)} {...props}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
        ))}
      </select>
      <span className="time-sep">:</span>
      <select value={minute} onChange={e => handleChange('minute', e.target.value)}>
        {Array.from({ length: 60 }, (_, i) => (
          <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
        ))}
      </select>
    </div>
  )
}
