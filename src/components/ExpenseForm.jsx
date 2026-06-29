import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { PEOPLE } from '../config'
import { todayISO } from '../lib/format'

const inputCls =
  'w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 outline-none transition focus:border-lake-500 focus:ring-4 focus:ring-lake-500/15'

export default function ExpenseForm({ onSubmit, onCancel }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('comida')
  const [who, setWho] = useState(PEOPLE[0])
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    setSaving(true)
    try {
      await onSubmit({ description, amount, category, who, date })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Monto destacado */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">¿Cuánto gastaron?</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-ink-soft">$</span>
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={`${inputCls} pl-10 text-2xl font-bold`}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">¿En qué?</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: cena, súper, nafta…"
          className={inputCls}
        />
      </div>

      {/* Categorías como chips */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-soft">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c.id === category
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition
                  ${active
                    ? 'border-transparent text-white shadow-soft'
                    : 'border-sand-200 bg-white text-ink hover:border-sand-300'}`}
                style={active ? { backgroundColor: c.color } : undefined}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quién + fecha */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Pagó</label>
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sand-100 p-1">
            {PEOPLE.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setWho(p)}
                className={`rounded-xl px-2 py-2 text-sm font-semibold transition
                  ${who === p ? 'bg-white text-lake-600 shadow-soft' : 'text-ink-soft'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 rounded-2xl border border-sand-200 px-4 py-3 font-semibold text-ink-soft transition hover:bg-sand-100">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-2xl bg-sunset-500 px-4 py-3 font-bold text-white shadow-soft transition hover:bg-sunset-600 active:scale-[.98] disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar gasto'}
        </button>
      </div>
    </form>
  )
}
