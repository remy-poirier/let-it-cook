import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'
import { useRealEstate } from '@/hooks/use-real-estate.ts'
import InvestmentRealEstate from '@/routes/patrimony/real-estate/chart.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'

export default function RealEstate() {
  const { investments: { lastUpdate, totalAmount, investments } } = useRealEstate()
  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">Patrimoine immobilier</h2>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastUpdate))}
        </span>
        <span className="font-bold text-3xl">{currencyFormatter.format(totalAmount)}</span>
      </div>
      <Card className="shadow-none">
        <CardContent>
          <InvestmentRealEstate />
        </CardContent>
      </Card>
      <span className="text-xl font-bold">Répartition de mon investissement</span>
      <hr />
      <div className="flex w-full justify-between text-muted-foreground text-sm">
        <span>Nom</span>
        <span>Montant (€)</span>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-4">
          {investments.map(investment => (
            <div key={investment.label} className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <span className="font-bold">{investment.label}</span>
                  <span className="text-muted-foreground text-sm">{dateFormatter.format(new Date(investment.date))}</span>
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
