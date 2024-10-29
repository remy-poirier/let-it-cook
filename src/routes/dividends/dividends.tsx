import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useData } from '@/hooks/useData.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'

export default function Dividends() {
  const { bricksData, ldds_credit_agricole } = useData()
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
            </CardHeader>
            <CardContent>
              TODO
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
