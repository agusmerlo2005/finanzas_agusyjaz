import { money } from '../lib/format'

function Card({ label, value, sub, tone = 'lake', icon }) {
  const tones = {
    lake: 'from-lake-500 to-lake-600',
    sunset: 'from-sunset-400 to-sunset-600',
    pine: 'from-pine-400 to-pine-600',
    sand: 'from-sand-300 to-sand-400',
  }
  return (
    <div className="card relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tones[tone]} opacity-10`} />
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
        <span className="text-lg">{icon}</span> {label}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-sm text-ink-soft">{sub}</div>}
    </div>
  )
}

export default function SummaryCards({ monthExpense, prevMonthExpense, totalSavings, monthSaving }) {
  let trend = null
  if (prevMonthExpense > 0) {
    const diff = ((monthExpense - prevMonthExpense) / prevMonthExpense) * 100
    const up = diff >= 0
    trend = (
      <span className={up ? 'text-sunset-600' : 'text-pine-600'}>
        {up ? '▲' : '▼'} {Math.abs(diff).toFixed(0)}% vs mes anterior
      </span>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Card icon="💸" tone="sunset" label="Gastos del mes" value={money(monthExpense)} sub={trend} />
      <Card icon="🌱" tone="pine" label="Ahorrado este mes" value={money(monthSaving)} />
      <Card icon="🏦" tone="lake" label="Ahorro acumulado" value={money(totalSavings)} sub="entre los dos" />
      <Card
        icon="⚖️"
        tone="sand"
        label="Neto del mes"
        value={money(monthSaving - monthExpense)}
        sub={monthSaving - monthExpense >= 0 ? 'guardaron más de lo que gastaron 🎉' : 'gastaron más de lo que guardaron'}
      />
    </div>
  )
}
