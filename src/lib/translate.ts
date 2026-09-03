const DE_EMAIL = 'brandmkrs.ads@gmail.com'

export async function translateText(text: string, from: string, to: string): Promise<string> {
  if (from === to || !text.trim()) return text
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${from}|${to}&de=${DE_EMAIL}`
    )
    const data = await res.json()
    if (data.responseStatus === 200) return data.responseData.translatedText || text
    return text
  } catch { return text }
}

export async function translateToAll(text: string, sourceLang: string): Promise<Record<string, string>> {
  const results: Record<string, string> = {}
  await Promise.all(['es', 'en', 'nl', 'de'].map(async lang => {
    results[lang] = lang === sourceLang ? text : await translateText(text, sourceLang, lang)
  }))
  return results
}

// Returns the best available translation for a given lang, falling back to original
export function getTranslated(
  translations: Record<string, string> | null | undefined,
  original: string,
  lang: string
): string {
  if (!translations) return original
  return translations[lang] || original
}
