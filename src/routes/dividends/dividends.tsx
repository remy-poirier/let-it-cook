import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useData } from '@/hooks/useData.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'
import { useNewsFeed } from '@/hooks/useNewsFeed.ts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi'

export default function Dividends() {
  const { bricksData, ldds_credit_agricole } = useData()
  const newsFeed = useNewsFeed(5)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Mes dividendes</h2>
      <div className="items-start justify-center gap-6 py-8 grid xl:grid-cols-3 md:grid-cols-2">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bricks</CardTitle>
              <CardDescription>Rendements immobilier</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 divide-y text-sm">
              <span className="flex justify-between p-2">
                <span>
                  Revenus
                </span>
                <span>
                  {currencyFormatter.format(TransactionsUtils.realEstate.totalProfitability(bricksData))}
                </span>
              </span>
              <span className="flex justify-between p-2">
                <span>
                  Fiscalité (30%)
                </span>
                <span>
                  {currencyFormatter.format(TransactionsUtils.realEstate.totalTax(bricksData))}
                </span>
              </span>
              <span className="flex justify-between p-2">
                <span>
                  Total net
                </span>
                <span className="font-bold">
                  {currencyFormatter.format(TransactionsUtils.realEstate.totalNetProfitability(bricksData))}
                </span>
              </span>
            </CardContent>
          </Card>
        </div>
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
              <CardTitle>Epsor - PEE</CardTitle>
            </CardHeader>
            <CardContent>
              TODO
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Actualités</CardTitle>
              <CardDescription>5 dernières actualités</CardDescription>
            </CardHeader>
            <CardContent>
              {newsFeed.map(entry => (
                <div
                  key={`${entry.label}-${entry.date}-${entry.kind}`}
                  className="flex justify-between p-2"
                >
                  <div className="flex gap-4">
                    <Avatar className="size-8">
                      <AvatarFallback
                        data-kind={entry.kind}
                        className="data-[kind=INVESTMENT]:bg-accent data-[kind=DIVIDEND]:bg-primary"
                      >
                        {entry.kind === 'INVESTMENT' ? <GiPayMoney size={16} /> : <GiReceiveMoney size={16} />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col gap-1">
                      <span>
                        {entry.label}
                      </span>
                      <span className="text-muted-foreground text-xs">{dateFormatter.format(new Date(entry.date))}</span>
                      <span className="text-muted-foreground text-xs">{entry.description}</span>
                    </span>
                  </div>

                  <span className="font-bold">
                    {currencyFormatter.format(entry.amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
