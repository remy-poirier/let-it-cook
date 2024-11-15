import { useEmployeeSavings } from '@/hooks/use-employee-savings.ts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx'
import { employeeSavingsChartConfig } from '@/utils/chart-config.ts'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { currencyFormatter } from '@/utils/formatters.ts'

export default function EmployeeSavingsChart() {
  const { chartData } = useEmployeeSavings()
  return (
    <ChartContainer config={employeeSavingsChartConfig} className="aspect-auto h-[250px] w-full">
      <AreaChart data={chartData} accessibilityLayer stackOffset="expand">
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
              indicator="dot"
              nameKey="amount"
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
          type="monotone"
          dataKey="amount"
          fill="var(--color-amount)"
          stroke="var(--color-amount)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  )
}