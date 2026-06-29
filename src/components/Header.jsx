import heroPhoto from '../assets/jaz.jpeg'
import { isConnected } from '../lib/api'

export default function Header({ onLogout }) {
  const today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date())

  return (
    <header className="relative overflow-hidden rounded-3xl shadow-lift">
      <img src={heroPhoto} alt="Jaz y Agus" className="absolute inset-0 h-full w-full object-cover object-[center_32%]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-lake-700/85 via-lake-600/45 to-sunset-500/25" />

      <div className="relative flex items-end justify-between gap-4 p-5 pt-24 sm:p-7 sm:pt-32">
        <div className="text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            {today}
          </p>
          <h1 className="mt-1 text-3xl text-white drop-shadow sm:text-4xl">
            Jaz <span className="font-display italic font-normal">&amp;</span> Agus
          </h1>
          <p className="mt-1 text-sm text-white/85">Nuestras finanzas compartidas</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur
            ${isConnected() ? 'bg-pine-500/90 text-white' : 'bg-white/85 text-ink'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected() ? 'bg-white' : 'bg-sunset-500'}`} />
            {isConnected() ? 'Conectado al Excel' : 'Modo demo'}
          </span>
          <button
            onClick={onLogout}
            className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
