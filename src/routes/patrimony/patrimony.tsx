import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useData, useEpsor } from '@/hooks/useData.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter, dateFormatter, percentageFormatter } from '@/utils/formatters.ts'
import { useNewsFeed } from '@/hooks/useNewsFeed.ts'
import NewsList from '@/components/news-list.tsx'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { NewsFeedEntry } from '@/domain/models.ts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx'
import { bricksChartConfig } from '@/utils/chart-config.ts'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export default function Patrimony() {
  const { bricksData, ldds_credit_agricole, epsor, pea, bricks } = useData()

  const [newsKindToDisplay, setNewsKindToDisplay] = useState<NewsFeedEntry['kind'] | undefined>(undefined)

  const newsFeed = useNewsFeed(5, newsKindToDisplay)
  const { lastStatement, estimatedAmount, amountWithLastStatement } = useEpsor()

  const updateKindToDisplay = (kind: string) => {
    if (kind === 'ALL') {
      setNewsKindToDisplay(undefined)
    }
    else {
      setNewsKindToDisplay(kind as NewsFeedEntry['kind'])
    }
  }

  console.log('bricksData', bricks)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Mon patrimoine</h2>
      <div className="items-start justify-center gap-6 py-8 grid xl:grid-cols-3 md:grid-cols-2">
        <div className="col-span-4 grid grid-cols-2 items-start gap-6 lg:col-span-2">
          <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>LDD Solidaire</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="flex justify-between">
                  <span>
                    Taux
                  </span>
                  <span className="font-bold">
                    {ldds_credit_agricole.rate}
                    {' '}
                    %
                  </span>
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Epsor - PEI</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <span className="flex justify-between">
                  <div className="grid">
                    <span>Plus-value</span>
                    <span
                      className="text-sm text-muted-foreground"
                    >
                      {dateFormatter.format(new Date(lastStatement.date))}
                    </span>
                  </div>
                  <div className="grid text-right">
                    <span className="font-bold">
                      {currencyFormatter.format(estimatedAmount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Taux:
                      {' '}
                      {percentageFormatter.format(lastStatement.rate / 100)}
                    </span>
                  </div>
                </span>
                <span className="flex justify-between">
                  <div className="grid">
                    <span>Total estimé</span>
                  </div>
                  <div className="grid text-right">
                    <span className="font-bold">
                      {currencyFormatter.format(amountWithLastStatement)}
                    </span>
                  </div>
                </span>
                <hr />
                <span className="flex justify-between">
                  <span>Contribution employeur annuelle</span>
                  <span className="font-bold">
                    {currencyFormatter.format(epsor.employer_contribution)}
                  </span>
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{pea.label}</CardTitle>
                <CardDescription>ETF & Actions</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 divide-y text-sm">
                <span className="flex justify-between py-2">
                  <span>
                    Ouverture du compte
                  </span>
                  <span>
                    {dateFormatter.format(new Date(pea.opening_date))}
                  </span>
                </span>
                <span className="flex justify-between py-2">
                  <span>Montant maximum</span>
                  <span>
                    {currencyFormatter.format(150000)}
                  </span>
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bricks</CardTitle>
                <CardDescription>Investissement immobilier</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 divide-y text-sm">
                <span className="flex justify-between py-2">
                  <span>
                    Revenus
                  </span>
                  <span>
                    {currencyFormatter.format(TransactionsUtils.realEstate.totalProfitability(bricksData))}
                  </span>
                </span>
                <span className="flex justify-between py-2">
                  <span>
                    Fiscalité (30%)
                  </span>
                  <span>
                    {currencyFormatter.format(TransactionsUtils.realEstate.totalTax(bricksData))}
                  </span>
                </span>
                <span className="flex justify-between py-2">
                  <span>
                    Total net
                  </span>
                  <span className="font-bold">
                    {currencyFormatter.format(TransactionsUtils.realEstate.totalNetProfitability(bricksData))}
                  </span>
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bricks</CardTitle>
                <CardDescription>Répartition de l&apos;investissement</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {bricks.investments.map(investment => (
                  <div key={investment.label} className="flex text-sm justify-between">
                    <span>{investment.label}</span>
                    <span className="font-bold">{currencyFormatter.format(investment.amount)}</span>
                  </div>
                ))}
                <hr />
                <div className="flex text-sm font-bold justify-between">
                  <span>Total</span>
                  <span>{currencyFormatter.format(bricks.sumInvestments)}</span>
                </div>
              </CardContent>
            </Card>

          </div>
          <div className="lg:col-span-2 grid items-start">
            <Card>
              <CardHeader>
                <CardTitle>Revenus Bricks</CardTitle>
                <CardDescription>Ces données tiennent compte de la fiscalité (-30%), et représente donc les vrais rentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={bricksChartConfig}
                  className="aspect-auto h-[200px] w-full"
                >
                  <BarChart accessibilityLayer data={bricks.dividendsChart}>
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
                          year: '2-digit',
                        })
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={(
                        <ChartTooltipContent
                          hideLabel
                          valueFormatter={value => currencyFormatter.format(value as number)}
                        />
                      )}
                    />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Actualités</CardTitle>
              <CardDescription>Que s&apos;est-il passé récemment ?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={newsKindToDisplay || 'ALL'} onValueChange={updateKindToDisplay}>
                <SelectTrigger
                  className="ml-auto h-7 w-[170px] rounded-sm pl-2.5"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Séctionnez un type d'investissement" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-sm">
                  {['ALL', 'INVESTMENT', 'DIVIDEND', 'INFO'].map((key: string) => {
                    return (
                      <SelectItem
                        key={key}
                        value={key}
                        className="rounded-lg [&_span]:flex"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            data-kind={key}
                            className="flex h-3 w-3 shrink-0 rounded-sm data-[kind=ALL]:bg-accent data-[kind=INVESTMENT]:bg-chart-1 data-[kind=DIVIDEND]:bg-primary data-[kind=INFO]:bg-chart-4"
                          />
                          {key === 'ALL' && 'Tous'}
                          {key === 'INVESTMENT' && 'Investissements'}
                          {key === 'DIVIDEND' && 'Rentrées d\'argent'}
                          {key === 'INFO' && 'Informations'}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <NewsList newsFeed={newsFeed} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
