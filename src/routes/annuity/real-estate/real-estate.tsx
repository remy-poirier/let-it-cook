import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'
import { useRealEstate } from '@/hooks/use-real-estate.ts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import AnnuityRealEstateChart from '@/routes/annuity/real-estate/annuity-real-estate-chart.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { InfoIcon } from 'lucide-react'
import { useNewsFeed } from '@/hooks/useNewsFeed.ts'
import NewsList from '@/components/news-list.tsx'

export default function RealEstate() {
  const {
    annuities: {
      lastUpdate, netProfitability, totalProfitability, totalTax, accumulatedAnnuities,
    },
    investments: {
      mostValuable,
    },
  } = useRealEstate()
  const news = useNewsFeed(4, 'DIVIDEND')

  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">Rentes immobilières</h2>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastUpdate))}
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-3xl">{currencyFormatter.format(netProfitability)}</span>
          <span className="flex items-center gap-2">
            <span className="text-sm">
              {currencyFormatter.format(totalProfitability)}
              {' '}
              de rentes - 30% de fiscalité (
              {currencyFormatter.format(Math.abs(totalTax))}
              )
            </span>
          </span>
        </div>
      </div>
      <Alert variant="informative">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information utile</AlertTitle>
        <AlertDescription>Le graphique ci-dessous tient compte de la fiscalité (30%)</AlertDescription>
      </Alert>
      <AnnuityRealEstateChart />
      <hr />
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-3 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Les plus rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col space-y-4 pt-2 text-sm">
                {mostValuable.map((investment, index) => (
                  <li key={investment.label} className="flex gap-4">
                    <span className="text-3xl">
                      {index + 1 === 1 && '🥇'}
                      {index + 1 === 2 && '🥈'}
                      {index + 1 === 3 && '🥉'}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-primary">
                        {investment.label}
                      </span>
                      <span>
                        Total net:
                        {' '}
                        <span className="font-bold">
                          {currencyFormatter.format(investment.netProfitability)}
                        </span>
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Brut:
                        {' '}
                        {currencyFormatter.format(investment.grossProfitability)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Fiscalité (30%):
                        {' '}
                        {' '}
                        {currencyFormatter.format(investment.tax)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 h-ful">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dividendes récents</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsList newsFeed={news} />
            </CardContent>
          </Card>
        </div>
      </div>
      <span className="text-xl font-bold">Répartition de mes rentes</span>
      <hr />
      <div className="flex w-full justify-between text-muted-foreground text-sm">
        <span>Nom</span>
        <span>Montant (€)</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex justify-between">
              <span>Total</span>
              <span>
                {currencyFormatter.format(totalProfitability)}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {accumulatedAnnuities.map(investment => (
            <div key={investment.label} className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <span>{investment.label}</span>
                </div>
              </div>
              <span className="font-bold">{currencyFormatter.format(investment.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
