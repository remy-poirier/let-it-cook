import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi'
import { currencyFormatter, dateFormatter } from '@/utils/formatters.ts'
import { NewsFeedEntry } from '@/domain/models.ts'

type Props = {
  newsFeed: NewsFeedEntry[]
}

export default function NewsCard({
  newsFeed,
}: Props) {
  return (

    <Card>
      <CardHeader>
        <CardTitle>Actualités</CardTitle>
        <CardDescription>Que s&apos;est-il passé récemment ?</CardDescription>
      </CardHeader>
      <CardContent>
        {newsFeed.map(entry => (
          <div
            key={`${entry.label}-${entry.date}-${entry.kind}`}
            className="flex justify-between p-2"
          >
            <div className="flex gap-4">
              <Avatar className="size-8">
                <AvatarFallback
                  data-kind={entry.kind}
                  className="data-[kind=INVESTMENT]:bg-accent data-[kind=DIVIDEND]:bg-primary"
                >
                  {entry.kind === 'INVESTMENT' ? <GiPayMoney size={16} /> : <GiReceiveMoney size={16} />}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col gap-1">
                <span>
                  {entry.label}
                </span>
                <span className="text-muted-foreground text-xs">{dateFormatter.format(new Date(entry.date))}</span>
                <span className="text-muted-foreground text-xs">{entry.description}</span>
              </span>
            </div>

            <span className="font-bold">
              {currencyFormatter.format(entry.amount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
