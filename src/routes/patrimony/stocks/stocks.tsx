import { useStocks } from '@/hooks/use-stocks.ts'
import { currencyFormatter, dateFormatter, percentageFormatter } from '@/utils/formatters.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { ArrowDown, ArrowUp, InfoIcon } from 'lucide-react'
import PatrimonyStocksChart from '@/routes/patrimony/stocks/chart.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx'
import bnpLogo from '@/assets/images/banks/bnp.png'
import boursoramaLogo from '@/assets/images/banks/bourso_bank.png'
import { useEtfPrice } from '@/hooks/use-etf-price.tsx'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const bankNameToImage = (bankName: string) => {
  switch (bankName) {
    case 'bnp':
      return bnpLogo
    case 'boursorama':
    default:
      return boursoramaLogo
  }
}

export default function Stocks() {
  const {
    lastUpdate, totalAmountInvested, stocks, totalValueForStock, quantityOfFundId,
    costPriceOfFundId, capitalGain,
  } = useStocks()

  const symbol = 'ESE.PA' // Symbole de l'ETF S&P 500

  // Utilisation de React Query pour les données
  const { data, isLoading } = useEtfPrice(symbol)

  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">Actions</h2>
      <div className="flex flex-col gap-4">
        <span className="text-3xl">{currencyFormatter.format(totalAmountInvested)}</span>
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastUpdate))}
        </span>
        {data?.date && (
          <Alert variant="informative">
            <InfoIcon className="h-4 w-4" />

            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Dernière actualisation du prix des ETF effectuée le
              {' '}
              {dateFormatter.format(new Date(data.date))}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Card className="shadow-none">
        <CardContent>
          <PatrimonyStocksChart />

        </CardContent>
      </Card>
      <Alert variant="warning">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Avertissement</AlertTitle>
        <AlertDescription>
          Le graphique ci-dessus représente le montant de vos investissements,
          {' '}
          <span className="font-bold">en ne tenant pas compte des fluctuations</span>
          {' '}
          actuelles. Il peut également y avoir une divergence entre les montants d'achats compte tenu des frais de courtage
          qui ne sont pas pris en compte par cette application.
        </AlertDescription>
      </Alert>
      <hr />
      <span className="text-xl font-bold">Comptes</span>
      <Card>
        <CardContent className="pb-0 px-0">
          {stocks.map(stock => (
            <Accordion key={stock.label} type="single" collapsible defaultValue={stock.label}>
              <AccordionItem value={stock.label} className="border-b-0">
                <AccordionTrigger placement="start" className="px-6 hover:no-underline">
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-3">
                      <img src={bankNameToImage(stock.bank)} alt={stock.label} className="object-contain w-8 h-8" />
                      <span className="font-bold">{stock.label}</span>
                    </div>
                    <span className="font-bold">
                      {currencyFormatter.format(totalValueForStock(stock))}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="mx-4 grid grid-cols-8 px-2 py-3 text-muted-foreground"
                  >
                    <span className="col-span-3">Nom</span>
                    <span className="col-span-1 text-right">Quantité</span>
                    <span className="col-span-1 text-right">Prix de revient</span>
                    <span className="col-span-1 text-right">Prix actuel</span>
                    <span className="col-span-1 text-right">Valeur</span>
                    <span className="col-span-1 text-right">+/- value</span>
                  </div>
                  {Object.keys(stock.funds).map(fundId => (
                    <div
                      key={fundId}
                      className="grid grid-cols-8 mx-4 hover:bg-accent px-2 py-3 rounded-md"
                    >
                      <span className="col-span-3 font-bold">{stock.funds[fundId].label}</span>
                      <span className="col-span-1 text-right">{quantityOfFundId(stock, fundId)}</span>
                      <span
                        className="col-span-1 text-right"
                      >
                        {currencyFormatter.format(costPriceOfFundId(stock, fundId))}
                      </span>
                      <span
                        className="col-span-1 text-right"
                      >
                        {isLoading && '...'}
                        <span className="flex flex-col items-end">
                          <span
                            data-trend={data?.trend}
                            className="rounded flex items-center gap-1 p-1 data-[trend='down']:text-red-600 data-[trend='down']:bg-red-200 data-[trend='up']:text-green-600 data-[trend='up']:bg-green-200"
                          >
                            {!isLoading && data && data.trend && data.trend === 'down' && <span><ArrowDown size={16} /></span>}
                            {!isLoading && data && data.trend && data.trend === 'up' && <span><ArrowUp size={16} /></span>}
                            {!isLoading && data?.price && currencyFormatter.format(data.price ?? 0)}
                          </span>
                        </span>
                        {!isLoading && !data && '-'}
                      </span>
                      <span className="col-span-1 text-right">
                        {currencyFormatter.format(totalValueForStock(stock))}
                      </span>
                      <span className="col-span-1 text-right">
                        <div
                          data-status={data?.price ? capitalGain(stock, fundId, data?.price ?? 0).amount > 0 ? 'positive' : 'negative' : 'null'}
                          className="flex flex-col gap-1 items-end data-[status='positive']:text-green-600 data-[status='negative']:text-red-500 data-[status='null']:text-slate-500"
                        >
                          <span className="font-bold">
                            {data?.price ? currencyFormatter.format(capitalGain(stock, fundId, data.price).amount) : '-'}
                          </span>
                          <span
                            data-status={data?.price ? capitalGain(stock, fundId, data.price).amount > 0 ? 'positive' : 'negative' : 'null'}
                            className="p-1 rounded text-xs data-[status='negative']:bg-red-200 data-[status='positive']:bg-green-200 data-[status='null']:bg-slate-200"
                          >
                            {data?.price ? percentageFormatter.format(capitalGain(stock, fundId, data.price).percentage / 100) : '-'}
                          </span>
                        </div>
                      </span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

        </CardContent>
      </Card>
    </div>
  )
}
