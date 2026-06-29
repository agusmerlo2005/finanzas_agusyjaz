import { money } from '../lib/format'

export default function Goals({ goals, savings, onAddGoal, onDelete }) {
  const savedFor = (name) =>
    savings.filter((s) => s.goal === name).reduce((sum, s) => sum + Number(s.amount || 0), 0)

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg">Metas de ahorro</h3>
        <button
          onClick={onAddGoal}
          className="rounded-full border border-sand-200 px-3 py-1.5 text-sm font-semibold text-lake-600 transition hover:bg-sand-100"
        >
          + Nueva meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="grid h-32 place-items-center rounded-2xl bg-sand-50 text-center text-sm text-ink-soft">
          Creá una meta: un viaje, el depto, lo que sueñen 💭
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((g) => {
            const saved = savedFor(g.name)
            const pct = g.target > 0 ? Math.min(100, (saved / g.target) * 100) : 0
            const done = pct >= 100
            return (
              <div key={g.id} className="group">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {done && '🎉 '}{g.name}
                  </p>
                  <button
                    onClick={() => onDelete('goal', g.id)}
                    aria-label="Borrar meta"
                    className="rounded px-1 text-sm text-ink-soft opacity-0 transition hover:text-sunset-600 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-sand-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-pine-400 to-pine-600 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {money(saved)} de {money(g.target)}
                  </span>
                  <span className="font-semibold text-pine-600">{pct.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
