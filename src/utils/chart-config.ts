import type { ChartConfig } from '@/components/ui/chart.tsx'

export const chartConfig = {
  views: {
    label: 'Montant',
    color: '',
  },
  ldds_credit_agricole: {
    label: 'LDDS Crédit Agricole',
    color: 'hsl(var(--chart-1))',
  },
  bricks: {
    label: 'Bricks',
    color: 'hsl(var(--chart-2))',
  },
  epsor: {
    label: 'Epsor - PEI',
    color: 'hsl(var(--chart-3))',
  },
  pea: {
    label: 'BoursoBank - PEA',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig
