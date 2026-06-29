import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { money, moneyShort } from '../lib/format'

const TooltipBox = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-sand-200 bg-white/95 px-3 py-2 text-sm shadow-lift backdrop-blur">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.payload.color }} />
          <span className="text-ink-soft">{p.name}:</span>
          <span className="font-semibold">{money(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function CategoryPie({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="card p-5">
      <h3 className="text-lg">Gastos por categoría</h3>
      <p className="mb-2 text-sm text-ink-soft">Este mes · {money(total)}</p>
      {total === 0 ? (
        <Empty text="Todavía no hay gastos este mes" />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-52 w-full sm:w-1/2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none" isAnimationActive={false}>
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-1.5 sm:w-1/2">
            {data.slice(0, 6).map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                <span className="flex-1 truncate">{d.emoji} {d.name}</span>
                <span className="font-semibold">{money(d.value)}</span>
                <span className="w-10 text-right text-ink-soft">{Math.round((d.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function MonthlyBars({ data }) {
  const hasData = data.some((d) => d.Gastos > 0 || d.Ahorros > 0)
  return (
    <div className="card p-5">
      <h3 className="text-lg">Evolución mensual</h3>
      <p className="mb-3 text-sm text-ink-soft">Gastos vs ahorros</p>
      {!hasData ? (
        <Empty text="Cargá movimientos para ver la evolución" />
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9dcc4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b6359' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={moneyShort} tick={{ fontSize: 12, fill: '#6b6359' }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipBox />} cursor={{ fill: 'rgba(201,123,90,0.06)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="Gastos" fill="#c97b5a" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
              <Bar dataKey="Ahorros" fill="#5b8c6e" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function PersonSplit({ data, total }) {
  return (
    <div className="card p-5">
      <h3 className="text-lg">Quién puso qué</h3>
      <p className="mb-3 text-sm text-ink-soft">Gastos del mes · {money(total)}</p>
      {total === 0 ? (
        <Empty text="Sin gastos este mes" />
      ) : (
        <div className="space-y-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-sand-100">
            {data.map((d, i) => (
              <div key={i} style={{ width: `${(d.value / total) * 100}%`, background: d.color }} className="h-full transition-all" />
            ))}
          </div>
          <ul className="space-y-2">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                <span className="flex-1 font-medium">{d.name}</span>
                <span className="font-semibold">{money(d.value)}</span>
                <span className="w-12 text-right text-sm text-ink-soft">{Math.round((d.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="grid h-44 place-items-center rounded-2xl bg-sand-50 text-center text-sm text-ink-soft">
      <span>{text}</span>
    </div>
  )
}
