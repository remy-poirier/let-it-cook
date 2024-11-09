import { useStocks } from '@/hooks/use-stocks.ts'
import { currencyFormatter, dateFormatter, percentageFormatter } from '@/utils/formatters.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { InfoIcon } from 'lucide-react'
import PatrimonyStocksChart from '@/routes/patrimony/stocks/chart.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx'
import bnpLogo from '@/assets/images/banks/bnp.png'
import boursoramaLogo from '@/assets/images/banks/bourso_bank.png'

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
    costPriceOfFundId, capitalGain, getCurrentStateOfFund,
  } = useStocks()

  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">Actions</h2>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastUpdate))}
        </span>
        <span className="text-3xl">{currencyFormatter.format(totalAmountInvested)}</span>
      </div>
      <Alert variant="informative">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Le graphique ci-dessous représente le montant de vos investissements,
          {' '}
          <span className="font-bold">en ne tenant pas compte des fluctuations</span>
          {' '}
          actuelles.
        </AlertDescription>
      </Alert>
      <PatrimonyStocksChart />
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
                        {currencyFormatter.format(getCurrentStateOfFund(stock, fundId).amount)}
                      </span>
                      <span
                        className="col-span-1 text-right"
                      >
                        {currencyFormatter.format(totalValueForStock(stock))}
                      </span>
                      <span
                        className="col-span-1 text-right"
                      >
                        <div
                          data-status={capitalGain(stock, fundId).amount > 0 ? 'positive' : 'negative'}
                          className="flex flex-col gap-1 items-end data-[status='positive']:text-green-600 data-[status='negative']:text-red-500"
                        >
                          <span className="font-bold">
                            {currencyFormatter.format(capitalGain(stock, fundId).amount)}
                          </span>
                          <span
                            data-status={capitalGain(stock, fundId).amount > 0 ? 'positive' : 'negative'}
                            className="p-1 rounded text-xs data-[status='negative']:bg-red-200 data-[status='positive']:bg-green-200"
                          >
                            {percentageFormatter.format(capitalGain(stock, fundId).percentage / 100)}
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
