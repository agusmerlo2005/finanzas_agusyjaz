import { useState } from 'react'
import { APP_PIN } from '../config'
import heroPhoto from '../assets/jaz.jpeg'

export default function Login({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pin === String(APP_PIN)) {
      localStorage.setItem('jaz-agus-auth', '1')
      onUnlock()
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 600)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in">
        <div className="card overflow-hidden">
          {/* Foto */}
          <div className="relative h-72 sm:h-80">
            <img
              src={heroPhoto}
              alt="Jaz y Agus"
              className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lake-700/80 via-lake-700/10 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Nuestras finanzas
              </p>
              <h1 className="text-3xl text-white drop-shadow-sm">Jaz & Agus</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-6 sm:p-8">
            <label className="block text-sm font-semibold text-ink-soft mb-2">
              Ingresá el PIN compartido
            </label>
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="• • • •"
              className={`w-full rounded-2xl border bg-sand-50 px-4 py-3.5 text-center text-2xl tracking-[0.5em] outline-none transition
                focus:border-lake-500 focus:ring-4 focus:ring-lake-500/15
                ${error ? 'border-sunset-500 ring-4 ring-sunset-500/20 animate-[pop_.3s]' : 'border-sand-200'}`}
            />
            {error && (
              <p className="mt-2 text-sm font-medium text-sunset-600">
                Ese no es el PIN 🙈
              </p>
            )}
            <button
              type="submit"
              className="mt-5 w-full rounded-2xl bg-lake-500 px-5 py-3.5 font-bold text-white shadow-soft
                transition hover:bg-lake-600 active:scale-[.98]"
            >
              Entrar
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-ink-soft">
          Hecho con cariño para los dos 💛
        </p>
      </div>
    </div>
  )
}
