import type { ChartConfig } from '@/components/ui/chart.tsx'

export const chartConfig = {
  views: {
    label: 'Montant',
    color: '',
  },
  bricks: {
    label: 'Bricks',
    color: 'hsl(var(--chart-2))',
  },
  epsor: {
    label: 'Epsor - PEI',
    color: 'hsl(var(--chart-3))',
  },
  stocks: {
    label: 'PEA',
    color: 'hsl(var(--chart-4))',
  },
  savings: {
    label: 'Livrets',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export const savingsChartConfig = {
  amount: {
    label: 'Montant:',
    color: 'hsl(var(--chart-1))',
  },
}

export const patrimonyBricksChartConfig = {
  amount: {
    label: 'Montant:',
    color: 'hsl(var(--chart-2))',
  },
}

export const annuityBricksChartConfig = {
  amount: {
    label: 'Montant:',
    color: 'hsl(var(--chart-1))',
  },
}

export const stocksChartConfig = {
  amount: {
    label: 'Montant:',
    color: 'hsl(var(--chart-4))',
  },
}
