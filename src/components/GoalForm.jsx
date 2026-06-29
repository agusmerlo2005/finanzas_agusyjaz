import { useState } from 'react'

const inputCls =
  'w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 outline-none transition focus:border-lake-500 focus:ring-4 focus:ring-lake-500/15'

export default function GoalForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !target || Number(target) <= 0) return
    setSaving(true)
    try {
      await onSubmit({ name, target })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Nombre de la meta</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Viaje al sur, Departamento, Casamiento…"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">¿Cuánto quieren juntar?</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-ink-soft">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="0"
            className={`${inputCls} pl-10 text-2xl font-bold`}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 rounded-2xl border border-sand-200 px-4 py-3 font-semibold text-ink-soft transition hover:bg-sand-100">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-2xl bg-lake-500 px-4 py-3 font-bold text-white shadow-soft transition hover:bg-lake-600 active:scale-[.98] disabled:opacity-60"
        >
          {saving ? 'Creando…' : 'Crear meta'}
        </button>
      </div>
    </form>
  )
}
