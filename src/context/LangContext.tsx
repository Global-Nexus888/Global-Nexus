import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'es' | 'en' | 'nl' | 'de'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void }

const Ctx = createContext<LangCtx>({ lang: 'es', setLang: () => {} })

function detectLang(): Lang {
  const saved = localStorage.getItem('gnlang') as Lang | null
  if (saved) return saved
  const browser = (navigator.language || 'es').toLowerCase()
  if (browser.startsWith('nl')) return 'nl'
  if (browser.startsWith('de')) return 'de'
  if (browser.startsWith('en')) return 'en'
  return 'es'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('gnlang', l)
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useLang() { return useContext(Ctx) }
