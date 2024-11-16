import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type CachedETFPrice = {
  price: string
  date: string
  trend?: 'up' | 'down'
}

type ETFPrice = {
  price: number
  date: string
  trend?: 'up' | 'down'
}

const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate()
  )
}

const fetchETFPrice = async (symbol: string) => {
  const API_KEY = import.meta.env.VITE_VANTAGE_API_KEY
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
  )
  if (response.data['Information']) {
    console.error('Erreur lors de la récupération du prix de l\'ETF:', response.data['Information'])
    // If we had previous data cached, returns it, it's still better than nothing
    const cached = localStorage.getItem('cachedETFPrice')
    if (cached) {
      try {
        const parsed: CachedETFPrice = JSON.parse(cached)
        return {
          price: parseFloat(parsed.price),
          date: parsed.date,
          trend: parsed.trend,
        }
      }
      catch (error) {
        console.error('Erreur de parsing du cache:', error)
        throw new Error('Erreur lors de la récupération du prix de l\'ETF')
      }
    }
    throw new Error('Erreur lors de la récupération du prix de l\'ETF')
  }
  const price = response.data['Global Quote']['05. price'] ?? '0'
  const date = response.data['Global Quote']['07. latest trading day'] ?? new Date().toISOString()

  const cached = localStorage.getItem('cachedETFPrice')
  let trend: CachedETFPrice['trend'] = undefined

  if (cached) {
    try {
      const parsed: CachedETFPrice = JSON.parse(cached)
      const previousPrice = parseFloat(parsed.price)

      // Compare les prix pour déterminer la tendance
      if (previousPrice < parseFloat(price)) {
        trend = 'up'
      }
      else if (previousPrice > parseFloat(price)) {
        trend = 'down'
      }
    }
    catch (error) {
      console.error('Erreur de parsing du cache pour calculer la tendance:', error)
    }
  }

  const cachedData: CachedETFPrice = { price, date: new Date().toISOString(), trend }

  localStorage.setItem('cachedETFPrice', JSON.stringify(cachedData))

  return {
    price: parseFloat(price),
    date: date,
    trend,
  }
}

export const useEtfPrice = (symbol: string) => {
  const { data, isLoading } = useQuery<ETFPrice>({
    queryKey: ['stock', symbol],
    retry: false,
    queryFn: async () => {
      const cached = localStorage.getItem('cachedETFPrice')
      if (cached) {
        try {
          const parsed: CachedETFPrice = JSON.parse(cached)

          if (isSameDay(parsed.date, new Date().toISOString())) {
            return {
              price: parseFloat(parsed.price),
              date: parsed.date,
              trend: parsed.trend,
            }
          }

          return fetchETFPrice(symbol)
        }
        catch (error) {
          console.error('Erreur de parsing du cache:', error)
          return {
            price: 0,
            date: new Date().toISOString(),
            trend: undefined,
          }
        }
      }

      return fetchETFPrice(symbol)
    },
  })

  return {
    data,
    isLoading,
  }
}
