import { CURRENCY, LOCALE } from '../config'

export const money = (n) =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0)

export const moneyShort = (n) => {
  const v = Number(n) || 0
  const abs = Math.abs(v)
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

export const fmtDate = (iso) => {
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

export const monthKey = (iso) => {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const monthLabel = (key) => {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return new Intl.DateTimeFormat(LOCALE, { month: 'short', year: '2-digit' }).format(d)
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
