import dataJson from '@/assets/patrimony.json'
import Statistic from '@/routes/investments/statistic.tsx'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'

export enum InvestmentKind {
  BOOKLET = 'BOOKLET',
  REAL_ESTATE = 'REAL_ESTATE',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
}

interface CommonDataEntry<T> {
  id: string
  label: string
  transactions: T[]
}

export interface CommonTransaction {
  date: string
  amount: number
  label: string
}

type BookletTransaction = CommonTransaction
type RealEstateTransaction = CommonTransaction & { profitability: number }

interface BookletDataEntry extends CommonDataEntry<BookletTransaction> {
  kind: InvestmentKind.BOOKLET
  rate: number
}

type RealEstateDataEntry = CommonDataEntry<RealEstateTransaction> & {
  kind: InvestmentKind.REAL_ESTATE
}
type ETFDataEntry = CommonDataEntry<CommonTransaction> & {
  kind: InvestmentKind.ETF
}

export type DataEntry = BookletDataEntry | RealEstateDataEntry | ETFDataEntry

type EntryRecords = 'ldds_credit_agricole' | 'bricks' | 'epsor'

type Data = Record<EntryRecords, DataEntry>

export default function Investments() {
  const data: Data = dataJson as Data
  const [activeChart, setActiveChart] = useState<EntryRecords>('bricks')

  const transactionsChart = TransactionsUtils.accumulate(data[activeChart].transactions)

  const chartConfig = {
    views: {
      label: 'Montant',
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
      label: 'Epsor - PEE',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  console.log('transactionsChart', transactionsChart)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Mes investissements</h2>
      <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
        {Object.entries(data).map(key => (
          <Statistic key={key[0]} entry={key[1]} />
        ))}
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
                tickMargin={10}
                axisLine={false}
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
