import { useSavings } from '@/hooks/useSavings.ts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx'
import { currencyFormatter, dateFormatter, percentageFormatter } from '@/utils/formatters.ts'
import { Card, CardContent } from '@/components/ui/card.tsx'
import creditAgricoleIcon from '@/assets/images/banks/credit-agricole.png'
import SavingChart from '@/routes/patrimony/savings/chart.tsx'

export default function Savings() {
  const { savings, totalAmountForSaving, amountForAccount, totalAmount, lastSavingUpdate } = useSavings()

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Livrets</h2>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">
          Dernier mouvement en date du
          {' '}
          {dateFormatter.format(new Date(lastSavingUpdate))}
        </span>
        <span className="font-bold text-3xl">{currencyFormatter.format(totalAmount)}</span>
      </div>
      <SavingChart />
      <span className="text-xl font-bold">Comptes</span>
      <hr />
      <div className="flex w-full justify-between text-muted-foreground text-sm">
        <span>Nom</span>
        <span>Montant (€)</span>
      </div>
      <Card>
        <CardContent className="pb-0 px-0">
          {savings.map(saving => (
            <Accordion key={saving.label} type="single" collapsible defaultValue={saving.label} className="w-full border-b-0">
              <AccordionItem value={saving.label} className="border-b-0">
                <AccordionTrigger placement="start" className="px-6 hover:no-underline">
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-3">
                      <img src={creditAgricoleIcon} alt={saving.label} className="object-contain w-8 h-8" />
                      <span className="font-bold">{saving.label}</span>
                    </div>
                    <span className="font-bold">
                      {currencyFormatter.format(totalAmountForSaving(saving))}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {saving.accounts.map(account => (
                    <div
                      key={account.label}
                      className="flex mx-4 justify-between hover:bg-accent px-2 py-3 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {account.label}
                        </span>
                        <span className="text-muted-foreground">
                          Montant maximum:
                          {' '}
                          <span className="font-bold">
                            {currencyFormatter.format(account.maxAmount)}
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          Taux:
                          {' '}
                          <span className="font-bold">
                            {percentageFormatter.format(account.rate / 100)}
                          </span>
                        </span>
                      </div>
                      <span className="font-bold">{currencyFormatter.format(amountForAccount(account))}</span>
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
