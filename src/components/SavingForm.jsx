import { useState } from 'react'
import { PEOPLE } from '../config'
import { todayISO } from '../lib/format'

const inputCls =
  'w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 outline-none transition focus:border-pine-500 focus:ring-4 focus:ring-pine-500/15'

export default function SavingForm({ goals = [], onSubmit, onCancel }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [who, setWho] = useState(PEOPLE[0])
  const [goal, setGoal] = useState('')
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    setSaving(true)
    try {
      await onSubmit({ description, amount, who, goal, date })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">¿Cuánto guardaron?</label>
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
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Concepto</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: aporte mensual, aguinaldo…"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">¿Para qué meta?</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputCls}>
          <option value="">Ahorro general</option>
          {goals.map((g) => (
            <option key={g.id} value={g.name}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Aportó</label>
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sand-100 p-1">
            {PEOPLE.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setWho(p)}
                className={`rounded-xl px-2 py-2 text-sm font-semibold transition
                  ${who === p ? 'bg-white text-pine-600 shadow-soft' : 'text-ink-soft'}`}
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
          className="flex-1 rounded-2xl bg-pine-500 px-4 py-3 font-bold text-white shadow-soft transition hover:bg-pine-600 active:scale-[.98] disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar ahorro'}
        </button>
      </div>
    </form>
  )
}
