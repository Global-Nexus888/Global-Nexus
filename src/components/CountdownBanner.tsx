import { useEffect, useState } from 'react'
import type { Lang } from '../types'

interface CountdownBannerProps {
  lang: Lang
}

const LABELS: Record<Lang, { days: string; hours: string; mins: string; secs: string; pre: string }> = {
  es: { days: 'días', hours: 'horas', mins: 'min', secs: 'seg', pre: '🚀 Lanzamiento oficial:' },
  en: { days: 'days', hours: 'hours', mins: 'min', secs: 'sec', pre: '🚀 Official launch:' },
  nl: { days: 'dagen', hours: 'uur', mins: 'min', secs: 'sec', pre: '🚀 Officiële lancering:' },
  pt: { days: 'dias', hours: 'horas', mins: 'min', secs: 'seg', pre: '🚀 Lançamento oficial:' },
}

function getTimeLeft() {
  const target = new Date('2026-08-28T00:00:00')
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    secs:  Math.floor((diff % 60000) / 1000),
  }
}

export default function CountdownBanner({ lang }: CountdownBannerProps) {
  const [time, setTime] = useState(getTimeLeft())
  const t = LABELS[lang]

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      style={{
        background: 'rgba(201,168,76,.06)',
        borderBottom: '1px solid var(--border)',
        padding: '.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '60px',
      }}
    >
      <span className="font-mono-jb" style={{ fontSize: '.7rem', color: 'var(--gold)', letterSpacing: '.1em' }}>
        {t.pre}
      </span>
      {[
        { val: time.days,  label: t.days },
        { val: time.hours, label: t.hours },
        { val: time.mins,  label: t.mins },
        { val: time.secs,  label: t.secs },
      ].map(({ val, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '.25rem' }}>
          <span className="font-playfair" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--white)' }}>
            {pad(val)}
          </span>
          <span className="font-mono-jb" style={{ fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.08em' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
