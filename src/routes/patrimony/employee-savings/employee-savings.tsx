import { currencyFormatter, currencyWithoutCentFormatter, dateFormatter } from '@/utils/formatters.ts'
import { useEmployeeSavings } from '@/hooks/use-employee-savings.ts'
import { InfoIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import EmployeeSavingsChart from '@/routes/patrimony/employee-savings/chart.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx'
import epsorLogo from '@/assets/images/organisms/epsor.png'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export default function EmployeeSavings() {
  const { lastUpdate, totalAmount, accounts, amountForAccount, transactions } = useEmployeeSavings()

  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight">Épargne salariale</h2>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastUpdate))}
        </span>
        <span className="text-3xl">{currencyWithoutCentFormatter.format(totalAmount)}</span>
      </div>
      <Alert variant="informative">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Le graphique ci-dessous représente le montant de vos investissements,
          {' '}
          <span className="font-bold">en ne tenant pas compte des fluctuations</span>
          {' '}
          du compte.
        </AlertDescription>
      </Alert>
      <EmployeeSavingsChart />
      <hr />
      <span className="text-xl font-bold">Comptes</span>
      <Alert variant="warning">
        <ExclamationTriangleIcon className="size-4" />
        <AlertTitle>Attention !</AlertTitle>
        <AlertDescription>
          Après vérification, il s&apos;avère qu&apos;il y a un écart de quelques € entre le montant affiché sur Epsor et l&apos;addition de
          toutes les transactions. Cela est (très probablement) dû à des arrondis effectués par Epsor. Cela n&apos;est
          pas dû au calcul des intérêts mais l&apos;écart semble plutôt se situer au niveau des versements. Étant
          donné que cette information n&apos;apparaît pas sur Epsor, nous ne pouvons pas l&apos;intérpréter ici.
        </AlertDescription>
      </Alert>
      <Card>
        <CardContent className="px-0 pb-0">

          {accounts.map(account => (
            <Accordion key={account.id} type="single" collapsible defaultValue={account.id}>
              <AccordionItem value={account.id} className="border-b-0">
                <AccordionTrigger placement="start" className="px-6 hover:no-underline">
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-3">
                      <img src={epsorLogo} alt={account.label} className="object-contain w-8 h-8" />
                      <span className="font-bold">{account.label}</span>
                    </div>
                    <span className="font-bold">
                      {currencyWithoutCentFormatter.format(amountForAccount)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {transactions.map(transaction => (
                    <div
                      key={transaction.date}
                      className="flex mx-4 justify-between hover:bg-accent px-2 py-3 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {transaction.label}
                        </span>
                        <span className="text-muted-foreground">
                          {dateFormatter.format(new Date(transaction.date))}
                        </span>
                      </div>
                      <span className="font-bold">
                        {currencyFormatter.format(transaction.amount)}
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
