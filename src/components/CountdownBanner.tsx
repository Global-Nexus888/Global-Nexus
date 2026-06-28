import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { useT } from '../lib/translations'

const LAUNCH = new Date('2026-08-28T00:00:00')

function getTimeLeft() {
  const diff = LAUNCH.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    secs:  Math.floor((diff % 60000) / 1000),
  }
}

export function isPreLaunch(): boolean {
  return Date.now() < LAUNCH.getTime()
}

export default function CountdownBanner() {
  const [time, setTime] = useState(getTimeLeft())
  const [visible, setVisible] = useState(true)
  const { lang } = useLang()
  const T = useT(lang)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time || !visible) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
      borderBottom: '1px solid rgba(13,148,136,.25)',
      padding: '7px 1rem',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.45)', letterSpacing: '.05em', fontWeight: 600 }}>
          {T('cd_label')}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#5EEAD4', fontWeight: 800 }}>{T('cd_off')}</span>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)' }}>·</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { v: time.days,  l: 'd' },
            { v: time.hours, l: 'h' },
            { v: time.mins,  l: 'm' },
            { v: time.secs,  l: 's' },
          ].map((unit, i) => (
            <span key={unit.l} style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              {i > 0 && <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '0.7rem', margin: '0 2px' }}>:</span>}
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                {String(unit.v).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,.3)', marginLeft: 1 }}>{unit.l}</span>
            </span>
          ))}
        </div>

        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)' }}>{T('cd_until')}</span>

        <a href="/precios" style={{ fontSize: '0.72rem', color: '#5EEAD4', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(94,234,212,.3)', padding: '2px 10px', borderRadius: 100 }}>
          {T('cd_cta')}
        </a>
      </div>

      <button onClick={() => setVisible(false)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,.25)', cursor: 'pointer', fontSize: 15, padding: 4, lineHeight: 1 }}>×</button>
    </div>
  )
}
