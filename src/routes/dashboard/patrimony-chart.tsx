import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx'
import { currencyFormatter } from '@/utils/formatters.ts'
import { EntryRecords } from '@/domain/models.ts'
import { useData } from '@/hooks/useData.ts'
import { chartConfig } from '@/utils/chart-config.ts'

type Props = {
  activeChart: EntryRecords
}

export default function PatrimonyChart({
  activeChart,
}: Props) {
  const { accumulatedTransactions } = useData()

  const transactionsChart = accumulatedTransactions[activeChart]

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={transactionsChart}
        stackOffset="expand"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
            })
          }}
        />
        <ChartTooltip
          cursor={false}
          content={(
            <ChartTooltipContent
              indicator="line"
              nameKey="views"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('fr-FR', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
              valueFormatter={value => currencyFormatter.format(value as number)}
            />
          )}
        />
        <Area
          dataKey="accumulatedAmount"
          type="natural"
          fill={`var(--color-${activeChart})`}
          stroke={`var(--color-${activeChart})`}
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  )
}
