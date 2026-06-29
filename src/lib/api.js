import { APPS_SCRIPT_URL } from '../config'
import { todayISO } from './format'

// ─────────────────────────────────────────────────────────────
//  Capa de datos.
//  • Si hay APPS_SCRIPT_URL  → lee/escribe en tu Google Sheet.
//  • Si NO hay              → "modo demo" guardando en el navegador,
//    así podés probar todo antes de conectar el Excel.
// ─────────────────────────────────────────────────────────────

export const isConnected = () => Boolean(APPS_SCRIPT_URL)

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

/* ============ MODO DEMO (localStorage) ============ */
const DEMO_KEY = 'jaz-agus-demo-v1'

const seed = () => ({
  expenses: [
    { id: uid(), date: shift(-2), description: 'Cena aniversario', category: 'salidas', amount: 28000, who: 'Agustín' },
    { id: uid(), date: shift(-4), description: 'Compra semanal', category: 'super', amount: 41500, who: 'Jazmín' },
    { id: uid(), date: shift(-9), description: 'Nafta', category: 'transporte', amount: 22000, who: 'Agustín' },
    { id: uid(), date: shift(-12), description: 'Luz + agua', category: 'servicios', amount: 18700, who: 'Jazmín' },
    { id: uid(), date: shift(-20), description: 'Delivery sushi', category: 'comida', amount: 15400, who: 'Agustín' },
    { id: uid(), date: shift(-34), description: 'Súper del mes', category: 'super', amount: 52000, who: 'Jazmín' },
    { id: uid(), date: shift(-40), description: 'Cine + pochoclos', category: 'salidas', amount: 12000, who: 'Agustín' },
  ],
  savings: [
    { id: uid(), date: shift(-15), description: 'Aporte mensual', amount: 60000, who: 'Agustín', goal: 'Viaje al sur' },
    { id: uid(), date: shift(-15), description: 'Aporte mensual', amount: 60000, who: 'Jazmín', goal: 'Viaje al sur' },
    { id: uid(), date: shift(-45), description: 'Aguinaldo', amount: 80000, who: 'Agustín', goal: 'Departamento' },
  ],
  goals: [
    { id: uid(), name: 'Viaje al sur', target: 400000 },
    { id: uid(), name: 'Departamento', target: 2000000 },
  ],
})

function shift(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const readDemo = () => {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const s = seed()
  localStorage.setItem(DEMO_KEY, JSON.stringify(s))
  return s
}
const writeDemo = (data) => localStorage.setItem(DEMO_KEY, JSON.stringify(data))

/* ============ MODO CONECTADO (Apps Script) ============ */
async function callScript(payload) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    // text/plain evita el preflight de CORS en Apps Script
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error('Error de red (' + res.status + ')')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

/* ============ API pública ============ */
export async function fetchAll() {
  if (!isConnected()) return readDemo()
  const data = await callScript({ action: 'getAll' })
  return {
    expenses: data.expenses || [],
    savings: data.savings || [],
    goals: data.goals || [],
  }
}

export async function addExpense(e) {
  const row = {
    id: uid(),
    date: e.date || todayISO(),
    description: e.description?.trim() || 'Gasto',
    category: e.category || 'otros',
    amount: Number(e.amount) || 0,
    who: e.who,
  }
  if (!isConnected()) {
    const d = readDemo(); d.expenses.unshift(row); writeDemo(d); return row
  }
  await callScript({ action: 'addExpense', row })
  return row
}

export async function addSaving(s) {
  const row = {
    id: uid(),
    date: s.date || todayISO(),
    description: s.description?.trim() || 'Ahorro',
    amount: Number(s.amount) || 0,
    who: s.who,
    goal: s.goal || '',
  }
  if (!isConnected()) {
    const d = readDemo(); d.savings.unshift(row); writeDemo(d); return row
  }
  await callScript({ action: 'addSaving', row })
  return row
}

export async function addGoal(g) {
  const row = { id: uid(), name: g.name?.trim() || 'Meta', target: Number(g.target) || 0 }
  if (!isConnected()) {
    const d = readDemo(); d.goals.push(row); writeDemo(d); return row
  }
  await callScript({ action: 'addGoal', row })
  return row
}

export async function removeItem(type, id) {
  if (!isConnected()) {
    const d = readDemo()
    const key = type === 'expense' ? 'expenses' : type === 'saving' ? 'savings' : 'goals'
    d[key] = d[key].filter((x) => x.id !== id)
    writeDemo(d)
    return
  }
  await callScript({ action: 'remove', type, id })
}
