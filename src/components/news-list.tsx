import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { currencyFormatter, dateFormatter, percentageFormatter } from '@/utils/formatters.ts'
import { NewsFeedEntry } from '@/domain/models.ts'
import { Activity, Building2, InfoIcon, Landmark, PiggyBank } from 'lucide-react'
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi'

type Props = {
  newsFeed: NewsFeedEntry[]
}

export default function NewsList({
  newsFeed,
}: Props) {
  const iconMappingToIcon = (iconMapping: string) => {
    switch (iconMapping) {
      case 'saving-investment':
        return <PiggyBank size={16} />
      case 'real-estate-investment':
        return <Building2 size={16} />
      case 'real-estate-dividend':
        return <GiReceiveMoney size={16} />
      case 'epsor-investment':
        return <Landmark size={16} />
      case 'stock-investment':
        return <GiPayMoney size={16} />
      case 'stock-purchase':
        return <Activity size={16} />
      case 'info':
      default:
        return <InfoIcon size={16} />
    }
  }

  return newsFeed.map(entry => (
    <div
      key={`${entry.label}-${entry.date}-${entry.kind}`}
      className="flex justify-between p-2"
    >
      <div className="flex gap-4">
        <Avatar className="size-8">
          <AvatarFallback
            data-kind={entry.kind}
            className="text-white data-[kind=INVESTMENT]:bg-chart-1 data-[kind=DIVIDEND]:bg-primary data-[kind=INFO]:bg-chart-4"
          >
            {iconMappingToIcon(entry.iconMapping)}
          </AvatarFallback>
        </Avatar>
        <span className="flex flex-col gap-1">
          <span>
            {entry.label}
          </span>
          <span className="text-xs">{entry.description}</span>
          <span className="text-muted-foreground text-xs">{dateFormatter.format(new Date(entry.date))}</span>
        </span>
      </div>
      <span className="font-bold">
        {(entry.kind === 'INFO' && entry.label === 'Epsor') && percentageFormatter.format(entry.amount / 100)}
        {entry.kind !== 'INFO' && currencyFormatter.format(entry.amount)}
      </span>
    </div>
  ))
}
