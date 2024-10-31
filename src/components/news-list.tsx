import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi'
import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'
import { NewsFeedEntry } from '@/domain/models.ts'
import { InfoIcon } from 'lucide-react'

type Props = {
  newsFeed: NewsFeedEntry[]
}

export default function NewsList({
  newsFeed,
}: Props) {
  const iconKind = (kind: NewsFeedEntry['kind']) => {
    switch (kind) {
      case 'INFO':
        return <InfoIcon size={16} />
      case 'DIVIDEND':
        return <GiReceiveMoney size={16} />
      default:
        return <GiPayMoney size={16} />
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
            {iconKind(entry.kind)}
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
        {currencyFormatter.format(entry.amount)}
      </span>
    </div>
  ))
}
