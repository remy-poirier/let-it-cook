import dataJson from '@/assets/patrimony.json'
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label, Pie, PieChart,
  Sector,
  XAxis,
} from 'recharts'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'
import { FaPiggyBank } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

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

const pieChartConfig = {
  value: {
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
  const [pieChartActiveKind, setPieChartActiveKind] = useState<string>('bricks')

  const transactionsChart = TransactionsUtils.accumulate(data[activeChart].transactions)

  const totalValues = Object.entries(data).reduce((acc, [key, value]) => {
    acc.push({
      key,
      value: TransactionsUtils.totalValue(value.transactions),
      fill: chartConfig[key as keyof typeof chartConfig]?.color ?? 'hsl(0, 0%, 0%)',
    })
    return acc
  }, [] as { key: string, value: number, fill: string }[])
  const totalValue = totalValues.reduce((acc, value) => acc + value.value, 0)
  const investmentKinds = totalValues.map(value => value.key)

  const activeIndex = useMemo(
    () => totalValues.findIndex(item => item.key === pieChartActiveKind),
    [pieChartActiveKind],
  )
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
                {currencyFormatter.format(totalValue)}
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

        <Card data-chart="interactive-pie" className="col-span-1">
          <ChartStyle id="interactive-pie" config={pieChartConfig} />
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
              config={pieChartConfig}
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
                              {data[pieChartActiveKind as EntryRecords].label}
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
