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

// Parsea una fecha SIEMPRE en hora local (evita el corrimiento de día por UTC).
// Acepta strings "YYYY-MM-DD" (lo que guarda el Excel) o un objeto Date.
const toLocalDate = (val) => {
  if (val instanceof Date) return isNaN(val) ? null : val
  if (typeof val === 'string') {
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    const d = new Date(val)
    return isNaN(d) ? null : d
  }
  return null
}

export const fmtDate = (val) => {
  const d = toLocalDate(val)
  if (!d) return String(val ?? '')
  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

export const monthKey = (val) => {
  const d = toLocalDate(val)
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const monthLabel = (key) => {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return new Intl.DateTimeFormat(LOCALE, { month: 'short', year: '2-digit' }).format(d)
}

// Fecha de hoy en hora LOCAL como "YYYY-MM-DD" (no usa UTC).
export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
