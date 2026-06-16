import { useTranslation } from '../context/LanguageContext'
import { gregorianToJalaliStr } from '../utils/dateFormat'
import ShamsiDatePicker from './ShamsiDatePicker'

export default function DateInput({ value, onChange, ...props }) {
  const { language } = useTranslation()

  if (language === 'fa') {
    return (
      <div className="date-input-wrapper">
        <ShamsiDatePicker value={value} onChange={onChange} {...props} />
      </div>
    )
  }

  return <input type="date" value={value} onChange={onChange} {...props} />
}
