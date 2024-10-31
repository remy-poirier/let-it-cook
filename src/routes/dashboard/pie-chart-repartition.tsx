import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Label, Pie, PieChart, Sector } from 'recharts'
import { currencyFormatter } from '@/utils/formatters.ts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { useMemo, useState } from 'react'
import { useData } from '@/hooks/useData.ts'
import { EntryRecords } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { chartConfig } from '@/utils/chart-config.ts'

export default function PieChartRepartition() {
  const { fullData } = useData()
  const [pieChartActiveKind, setPieChartActiveKind] = useState<string>('bricks')

  const totalValues = Object.entries(fullData).reduce((acc, [key, value]) => {
    acc.push({
      key,
      value: TransactionsUtils.totalValue(value.transactions),
      fill: chartConfig[key as keyof typeof chartConfig]?.color ?? 'hsl(0, 0%, 0%)',
    })
    return acc
  }, [] as { key: string, value: number, fill: string }[])
  const investmentKinds = totalValues.map(value => value.key)

  const activeIndex = useMemo(
    () => totalValues.findIndex(item => item.key === pieChartActiveKind),
    [pieChartActiveKind],
  )
  return (
    <Card data-chart="interactive-pie" className="col-span-1">
      <ChartStyle id="interactive-pie" config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Répartition</CardTitle>
          <CardDescription>De votre patrimoine</CardDescription>
        </div>
        <Select value={pieChartActiveKind} onValueChange={setPieChartActiveKind}>
          <SelectTrigger
            className="ml-auto h-7 w-[200px] rounded-sm pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Séctionnez un type d'investissement" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-sm">
            {investmentKinds.map((key: string) => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) {
                return null
              }
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          id="interactive-pie"
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={(
                <ChartTooltipContent
                  hideLabel
                  valueFormatter={value => (
                    <span className="font-bold ml-2">{typeof value === 'number' ? currencyFormatter.format(value) : value}</span>
                  )}
                />
              )}
            />
            <Pie
              data={totalValues}
              dataKey="value"
              nameKey="key"
              innerRadius={90}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {currencyFormatter.format(totalValues[activeIndex].value)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {fullData[pieChartActiveKind as EntryRecords].label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
