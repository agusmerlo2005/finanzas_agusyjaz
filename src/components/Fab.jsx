import { useState } from 'react'

export default function Fab({ onExpense, onSaving }) {
  const [open, setOpen] = useState(false)

  const pick = (fn) => { setOpen(false); fn() }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {/* Acciones */}
      <div className={`mb-3 flex flex-col items-end gap-2 transition-all duration-200
        ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
        <button
          onClick={() => pick(onSaving)}
          className="flex items-center gap-2 rounded-full bg-pine-500 py-2.5 pl-4 pr-3 font-semibold text-white shadow-lift transition hover:bg-pine-600"
        >
          Ahorro <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">🌱</span>
        </button>
        <button
          onClick={() => pick(onExpense)}
          className="flex items-center gap-2 rounded-full bg-sunset-500 py-2.5 pl-4 pr-3 font-semibold text-white shadow-lift transition hover:bg-sunset-600"
        >
          Gasto <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">💸</span>
        </button>
      </div>

      {/* Botón principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Agregar"
        className={`ml-auto flex h-15 w-15 items-center justify-center rounded-full bg-lake-500 text-3xl text-white shadow-lift transition
          hover:bg-lake-600 active:scale-95 ${open ? 'rotate-45' : ''}`}
        style={{ height: '3.75rem', width: '3.75rem' }}
      >
        +
      </button>
    </div>
  )
}
