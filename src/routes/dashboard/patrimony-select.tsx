import { EntryRecords } from '@/domain/models.ts'
import { currencyFormatter } from '@/utils/formatters.ts'
import { useData } from '@/hooks/useData.ts'

type Props = {
  activeChart: EntryRecords
  setActiveChart: (chart: EntryRecords) => void
}

export default function PatrimonySelect({
  activeChart, setActiveChart,
}: Props) {
  const { chartData } = useData()

  return ['savings', 'bricks', 'epsor', 'stocks'].map((key) => {
    const chartKey = key as EntryRecords

    return (
      <button
        key={`${key}-chart`}
        data-active={activeChart === chartKey}
        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
        onClick={() => setActiveChart(chartKey)}
      >
        <span className="text-xs text-muted-foreground">
          {chartData.label(chartKey)}
        </span>
        <span className="text-lg leading-none sm:text-3xl">
          {currencyFormatter.format(chartData.amount(chartKey))}
        </span>
      </button>
    )
  })
}
