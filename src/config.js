// ============================================================
//  CONFIGURACIÓN  —  editá esto cuando tengas la URL del Excel
// ============================================================

// 1) Pegá acá la URL que te da Google al publicar el Apps Script
//    (ver INSTRUCCIONES.md). Mientras esté vacío, la app funciona
//    en "modo demo" con datos de ejemplo en tu navegador.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoOFUFU2F2OK-jJfjn2OctM9ljdPK8EhS1SRS1gCaaSzd0GH7MGeDmRMyMYKeofDNI5g/exec'
  import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwoOFUFU2F2OK-jJfjn2OctM9ljdPK8EhS1SRS1gCaaSzd0GH7MGeDmRMyMYKeofDNI5g/exec'

// 2) PIN compartido para entrar (lo saben Jaz y Agus)
export const APP_PIN = import.meta.env.VITE_APP_PIN || '20052003'

// 3) Quiénes usan la app
export const PEOPLE = ['Agustín', 'Jazmín']

// 4) Moneda
export const CURRENCY = 'ARS'
export const LOCALE = 'es-AR'
