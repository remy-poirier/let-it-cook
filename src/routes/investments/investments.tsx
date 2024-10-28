import dataJson from '@/assets/patrimony.json'
import Statistic from '@/routes/investments/statistic.tsx'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'

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

interface CommonTransaction {
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

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig

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
              Représentant l&apos;évolution de votre patrimoine sur les 12 derniers
              mois
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
                >
                  {data[chartKey].label}
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px]">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="desktop" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
