import { EntryRecords } from '@/domain/models.ts'
import { currencyFormatter } from '@/utils/formatters.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { useData } from '@/hooks/useData.ts'

type Props = {
  activeChart: EntryRecords
  setActiveChart: (chart: EntryRecords) => void
}

export default function PatrimonySelect({
  activeChart, setActiveChart,
}: Props) {
  const { fullData } = useData()

  return ['ldds_credit_agricole', 'bricks', 'epsor', 'pea'].map((key) => {
    const chartKey = key as EntryRecords
    if (!fullData[chartKey]) return null

    return (
      <button
        key={`${key}-chart`}
        data-active={activeChart === chartKey}
        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
        onClick={() => setActiveChart(chartKey)}
      >
        <span className="text-xs text-muted-foreground">
          {fullData[chartKey].label}
        </span>
        <span className="text-lg font-bold leading-none sm:text-3xl">
          {currencyFormatter.format(TransactionsUtils.totalValue(fullData[chartKey].transactions))}
        </span>
      </button>
    )
  })
}