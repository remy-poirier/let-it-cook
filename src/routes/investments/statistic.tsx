import { DataEntry, InvestmentKind } from '@/routes/investments/investments.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { FaBuilding, FaPiggyBank } from 'react-icons/fa'
import { RiMoneyEuroCircleLine } from 'react-icons/ri'
import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'

type Props = { entry: DataEntry }

export default function Statistic({
  entry: { label, transactions, kind },
}: Props) {
  const totalValue = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  const lastTransaction = transactions[transactions.length - 1]

  const icon = () => {
    switch (kind) {
      case InvestmentKind.BOOKLET:
        return <FaPiggyBank />
      case InvestmentKind.REAL_ESTATE:
        return <FaBuilding />
      case InvestmentKind.ETF:
      default:
        return <RiMoneyEuroCircleLine />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>{label}</span>
          {icon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="text-2xl font-bold">
          {currencyFormatter.format(totalValue)}
        </span>
        {lastTransaction && (
          <span className="text-slate-400 text-sm">
            {currencyFormatter.format(lastTransaction.amount)}
            {' '}
            investi le
            {' '}
            {' '}
            {dateFormatter.format(new Date(lastTransaction.date))}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
