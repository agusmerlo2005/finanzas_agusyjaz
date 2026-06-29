// Categorías de gastos con su color e ícono (emoji)
export const CATEGORIES = [
  { id: 'comida', label: 'Comida', emoji: '🍽️', color: '#c97b5a' },
  { id: 'super', label: 'Súper', emoji: '🛒', color: '#e0936c' },
  { id: 'salidas', label: 'Salidas', emoji: '🍷', color: '#a85f42' },
  { id: 'casa', label: 'Casa', emoji: '🏠', color: '#5b8c6e' },
  { id: 'servicios', label: 'Servicios', emoji: '💡', color: '#7a9b7e' },
  { id: 'transporte', label: 'Transporte', emoji: '🚗', color: '#4d86a4' },
  { id: 'viajes', label: 'Viajes', emoji: '✈️', color: '#2c5f7c' },
  { id: 'salud', label: 'Salud', emoji: '💊', color: '#7fa8be' },
  { id: 'regalos', label: 'Regalos', emoji: '🎁', color: '#c4ac85' },
  { id: 'otros', label: 'Otros', emoji: '🌀', color: '#9a8f7d' },
]

export const categoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
