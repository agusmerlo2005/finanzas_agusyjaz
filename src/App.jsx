import { useEffect, useMemo, useState } from 'react'
import {
  fetchAll, addExpense, addSaving, addGoal, removeItem,
} from './lib/api'
import { categoryById } from './lib/categories'
import { monthKey, monthLabel } from './lib/format'
import { PEOPLE } from './config'

import Login from './components/Login'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import { CategoryPie, MonthlyBars, PersonSplit } from './components/Charts'
import Transactions from './components/Transactions'
import Goals from './components/Goals'
import Fab from './components/Fab'
import Modal from './components/Modal'
import ExpenseForm from './components/ExpenseForm'
import SavingForm from './components/SavingForm'
import GoalForm from './components/GoalForm'

const PERSON_COLORS = { [PEOPLE[0]]: '#2c5f7c', [PEOPLE[1]]: '#c97b5a' }

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('jaz-agus-auth') === '1')
  const [data, setData] = useState({ expenses: [], savings: [], goals: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // 'expense' | 'saving' | 'goal'

  useEffect(() => {
    if (!authed) return
    let alive = true
    setLoading(true)
    fetchAll()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message || 'No se pudieron cargar los datos'))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [authed])

  // ───── Cálculos ─────
  const m = useMemo(() => {
    const now = monthKey(new Date().toISOString())
    const prev = (() => {
      const d = new Date(); d.setMonth(d.getMonth() - 1)
      return monthKey(d.toISOString())
    })()

    const monthExp = data.expenses.filter((e) => monthKey(e.date) === now)
    const monthExpense = monthExp.reduce((s, e) => s + Number(e.amount || 0), 0)
    const prevMonthExpense = data.expenses
      .filter((e) => monthKey(e.date) === prev)
      .reduce((s, e) => s + Number(e.amount || 0), 0)
    const monthSaving = data.savings
      .filter((s) => monthKey(s.date) === now)
      .reduce((s, x) => s + Number(x.amount || 0), 0)
    const totalSavings = data.savings.reduce((s, x) => s + Number(x.amount || 0), 0)

    // Torta por categoría (mes actual)
    const byCat = {}
    monthExp.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount || 0) })
    const pieData = Object.entries(byCat)
      .map(([id, value]) => {
        const c = categoryById(id)
        return { name: c.label, emoji: c.emoji, color: c.color, value }
      })
      .sort((a, b) => b.value - a.value)

    // Split por persona (mes actual)
    const splitData = PEOPLE.map((p) => ({
      name: p,
      color: PERSON_COLORS[p],
      value: monthExp.filter((e) => e.who === p).reduce((s, e) => s + Number(e.amount || 0), 0),
    }))

    // Barras: últimos 6 meses
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      months.push(monthKey(d.toISOString()))
    }
    const barData = months.map((k) => ({
      month: monthLabel(k),
      Gastos: data.expenses.filter((e) => monthKey(e.date) === k).reduce((s, e) => s + Number(e.amount || 0), 0),
      Ahorros: data.savings.filter((s) => monthKey(s.date) === k).reduce((acc, s) => acc + Number(s.amount || 0), 0),
    }))

    return { monthExpense, prevMonthExpense, monthSaving, totalSavings, pieData, splitData, barData }
  }, [data])

  // ───── Handlers ─────
  const reload = () => fetchAll().then(setData).catch(() => {})

  const handleExpense = async (payload) => {
    const row = await addExpense(payload)
    setData((d) => ({ ...d, expenses: [row, ...d.expenses] }))
    setModal(null)
  }
  const handleSaving = async (payload) => {
    const row = await addSaving(payload)
    setData((d) => ({ ...d, savings: [row, ...d.savings] }))
    setModal(null)
  }
  const handleGoal = async (payload) => {
    const row = await addGoal(payload)
    setData((d) => ({ ...d, goals: [...d.goals, row] }))
    setModal(null)
  }
  const handleDelete = async (kind, id) => {
    const key = kind === 'expense' ? 'expenses' : kind === 'saving' ? 'savings' : 'goals'
    setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }))
    try { await removeItem(kind, id) } catch { reload() }
  }

  const logout = () => {
    localStorage.removeItem('jaz-agus-auth')
    setAuthed(false)
  }

  if (!authed) return <Login onUnlock={() => setAuthed(true)} />

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      <Header onLogout={logout} />

      {error && (
        <div className="mt-4 rounded-2xl border border-sunset-500/30 bg-sunset-500/10 px-4 py-3 text-sm text-sunset-600">
          {error} — revisá la URL del Excel en <code>src/config.js</code>.
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <main className="mt-5 space-y-4 sm:space-y-5">
          <div className="animate-in"><SummaryCards {...m} /></div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="animate-in"><CategoryPie data={m.pieData} /></div>
            <div className="animate-in"><MonthlyBars data={m.barData} /></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="animate-in"><PersonSplit data={m.splitData} total={m.monthExpense} /></div>
            <div className="animate-in">
              <Goals
                goals={data.goals}
                savings={data.savings}
                onAddGoal={() => setModal('goal')}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <div className="animate-in">
            <Transactions expenses={data.expenses} savings={data.savings} onDelete={handleDelete} />
          </div>

          <footer className="py-6 text-center text-sm text-ink-soft">
            Jaz &amp; Agus · hecho con 💛
          </footer>
        </main>
      )}

      <Fab onExpense={() => setModal('expense')} onSaving={() => setModal('saving')} />

      <Modal open={modal === 'expense'} onClose={() => setModal(null)} title="Nuevo gasto">
        <ExpenseForm onSubmit={handleExpense} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'saving'} onClose={() => setModal(null)} title="Nuevo ahorro">
        <SavingForm goals={data.goals} onSubmit={handleSaving} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'goal'} onClose={() => setModal(null)} title="Nueva meta">
        <GoalForm onSubmit={handleGoal} onCancel={() => setModal(null)} />
      </Modal>
    </div>
  )
}

function Loader() {
  return (
    <div className="mt-5 space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/60" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
      </div>
    </div>
  )
}
