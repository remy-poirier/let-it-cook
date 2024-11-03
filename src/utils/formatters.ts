export const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export const percentageFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  minimumFractionDigits: 2,
})

// Date format should just be DD/MM/YYYY
export const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
})

export const currencyWithoutCentFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
