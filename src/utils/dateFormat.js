import { toJalaali, toGregorian } from 'jalaali-js'

export function formatDate(dateStr, lang, options = {}) {
  if (!dateStr) return ''
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'))
  if (isNaN(date.getTime())) return ''
  const locale = lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US'
  try {
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch {
    return date.toLocaleDateString('en-US', options)
  }
}

export function formatDateShort(dateStr, lang) {
  if (lang === 'fa') return formatDate(dateStr, lang, { month: 'long', day: 'numeric' })
  return formatDate(dateStr, lang, { month: 'short', day: 'numeric' })
}

export function formatDateFull(dateStr, lang) {
  return formatDate(dateStr, lang, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateFullFa(dateStr) {
  return formatDate(dateStr, 'fa', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

export function gregorianToJalaliStr(gregorianStr) {
  if (!gregorianStr) return ''
  const parts = gregorianStr.split('-')
  if (parts.length !== 3) return ''
  const [gy, gm, gd] = parts.map(Number)
  if (!gy || !gm || !gd) return ''
  const j = toJalaali(gy, gm, gd)
  return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`
}

export function jalaliToGregorianStr(jalaliStr) {
  if (!jalaliStr) return ''
  const parts = jalaliStr.split('/')
  if (parts.length !== 3) return ''
  const [jy, jm, jd] = parts.map(Number)
  if (!jy || !jm || !jd) return ''
  const g = toGregorian(jy, jm, jd)
  return `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`
}
