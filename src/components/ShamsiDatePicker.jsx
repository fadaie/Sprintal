import { toJalaali, toGregorian } from 'jalaali-js'

const MONTHS_FA = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]

function getDaysInMonth(jy, jm) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  const j = toJalaali(jy + 1, 1, 1)
  const j2 = toJalaali(jy, 12, 1)
  const diff = (j.jd + (j.jm - 1) * 30 + (j.jm <= 6 ? j.jm * 1 : 30)) - (j2.jd + (j2.jm - 1) * 30 + (j2.jm <= 6 ? j2.jm * 1 : 30))
  return diff === 30 ? 30 : 29
}

export default function ShamsiDatePicker({ value, onChange, ...props }) {
  let jy = 1403, jm = 1, jd = 1
  if (value) {
    const parts = value.split('-')
    if (parts.length === 3) {
      const g = toJalaali(Number(parts[0]), Number(parts[1]), Number(parts[2]))
      jy = g.jy; jm = g.jm; jd = g.jd
    }
  }

  function handleChange(field, val) {
    const nv = Number(val)
    let ny = jy, nm = jm, nd = jd
    if (field === 'year') ny = nv
    if (field === 'month') { nm = nv; nd = Math.min(jd, getDaysInMonth(ny, nv)) }
    if (field === 'day') nd = nv
    try {
      const g = toGregorian(ny, nm, nd)
      const iso = `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`
      onChange({ target: { value: iso } })
    } catch { /* invalid date */ }
  }

  const daysInMonth = getDaysInMonth(jy, jm)

  return (
    <div className="shamsi-picker">
      <select value={jy} onChange={e => handleChange('year', e.target.value)} {...props}>
        {Array.from({ length: 15 }, (_, i) => {
          const y = 1400 + i
          return <option key={y} value={y}>{y}</option>
        })}
      </select>
      <select value={jm} onChange={e => handleChange('month', e.target.value)}>
        {MONTHS_FA.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>
      <select value={Math.min(jd, daysInMonth)} onChange={e => handleChange('day', e.target.value)}>
        {Array.from({ length: daysInMonth }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
  )
}
