import { useState } from 'react'
import { categoryById } from '../lib/categories'
import { money, fmtDate } from '../lib/format'

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'expense', label: 'Gastos' },
  { id: 'saving', label: 'Ahorros' },
]

export default function Transactions({ expenses, savings, onDelete }) {
  const [filter, setFilter] = useState('all')

  const items = [
    ...expenses.map((e) => ({ ...e, kind: 'expense' })),
    ...savings.map((s) => ({ ...s, kind: 'saving' })),
  ]
    .filter((i) => (filter === 'all' ? true : i.kind === filter))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 40)

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg">Movimientos</h3>
        <div className="flex gap-1 rounded-full bg-sand-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition
                ${filter === f.id ? 'bg-white text-lake-600 shadow-soft' : 'text-ink-soft'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="grid h-40 place-items-center text-sm text-ink-soft">
          Todavía no hay movimientos
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-sand-100">
          {items.map((it) => {
            const isExp = it.kind === 'expense'
            const cat = isExp ? categoryById(it.category) : null
            return (
              <li key={it.kind + it.id} className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-sand-50">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
                  style={{ background: isExp ? `${cat.color}22` : '#5b8c6e22' }}
                >
                  {isExp ? cat.emoji : '🌱'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {it.description || (isExp ? cat.label : 'Ahorro')}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {isExp ? cat.label : it.goal ? `Meta: ${it.goal}` : 'Ahorro general'} · {it.who} · {fmtDate(it.date)}
                  </p>
                </div>
                <span className={`shrink-0 font-bold ${isExp ? 'text-sunset-600' : 'text-pine-600'}`}>
                  {isExp ? '−' : '+'}{money(it.amount)}
                </span>
                <button
                  onClick={() => onDelete(it.kind, it.id)}
                  aria-label="Borrar"
                  className="ml-1 shrink-0 rounded-lg px-2 py-1 text-ink-soft opacity-0 transition hover:bg-sunset-500/10 hover:text-sunset-600 group-hover:opacity-100"
                >
                  🗑
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
