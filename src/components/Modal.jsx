import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-lake-700/40 backdrop-blur-sm" />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-md animate-in card rounded-b-none sm:rounded-3xl
          max-h-[92svh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-sand-200 bg-white/95 px-6 py-4 backdrop-blur">
          <h2 className="text-xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full bg-sand-100 text-ink-soft transition hover:bg-sand-200"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
