import { createContext, useContext, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import en from '../i18n/en'
import fa from '../i18n/fa'

const translations = { en, fa }
const LTR_LANGS = ['en']
const RTL_LANGS = ['fa']

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('flowboard-lang', 'en')

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
    document.documentElement.setAttribute('dir', RTL_LANGS.includes(language) ? 'rtl' : 'ltr')
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'fa' : 'en')
  }, [setLanguage])

  const t = useCallback((key, params = {}) => {
    const lang = translations[language] || en
    let str = lang[key] || en[key] || key
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v)
      })
    }
    return str
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
