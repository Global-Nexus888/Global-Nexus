import { useState } from 'react'
import type { Lang } from '../types'

export function useLang() {
  const [lang, setLang] = useState<Lang>('es')
  return { lang, setLang }
}
