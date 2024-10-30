import dataJson from '@/assets/patrimony.json'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from 'recharts'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'
import { FaPiggyBank } from 'react-icons/fa'
import NewsCard from '@/components/news-card.tsx'
import { useNewsFeed } from '@/hooks/useNewsFeed.ts'
import { useData } from '@/hooks/useData.ts'
import PieChartRepartition from '@/routes/investments/pie-chart-repartition.tsx'
import { Data, EntryRecords } from '@/domain/models.ts'

const chartConfig = {
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
} satisfies ChartConfig

export default function Investments() {
  const data: Data = dataJson as Data
  const [activeChart, setActiveChart] = useState<EntryRecords>('bricks')
  const newsFeed = useNewsFeed(3, 'INVESTMENT')
  const { investedAmount } = useData()

  const transactionsChart = TransactionsUtils.accumulate(data[activeChart].transactions)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Mes investissements</h2>
      <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-1">
        <div className="col-span-1 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between">
                <span>Patrimoine total</span>
                <FaPiggyBank />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <span className="text-2xl font-bold">
                {currencyFormatter.format(investedAmount)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between">
                <span>Diversification</span>
                <FaPiggyBank />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <span className="text-2xl font-bold">
                {Object.values(data).length}
              </span>
              <span className="text-muted-foreground text-sm">Investissements dans des actifs différents</span>
            </CardContent>
          </Card>
        </div>
        <PieChartRepartition />
        <div className="col-span-1 grid">
          <NewsCard newsFeed={newsFeed} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Graphique</CardTitle>
            <CardDescription>
              Représentant l&apos;évolution de votre patrimoine par catégorie
            </CardDescription>
          </div>
          <div className="flex">
            {['ldds_credit_agricole', 'bricks', 'epsor'].map((key) => {
              const chartKey = key as EntryRecords
              if (!data[chartKey]) return null
              return (
                <button
                  key={`${key}-chart`}
                  data-active={activeChart === chartKey}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chartKey)}
                >
                  <span className="text-xs text-muted-foreground">
                    {data[chartKey].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {currencyFormatter.format(TransactionsUtils.totalValue(data[chartKey].transactions))}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
