import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { currencyFormatter } from '@/utils/formatters.ts'
import { FaPiggyBank } from 'react-icons/fa'
import NewsList from '@/components/news-list.tsx'
import { useNewsFeed } from '@/hooks/useNewsFeed.ts'
import { useData } from '@/hooks/useData.ts'
import PieChartRepartition from '@/routes/dashboard/pie-chart-repartition.tsx'
import { EntryRecords } from '@/domain/models.ts'
import PatrimonySelect from '@/routes/dashboard/patrimony-select.tsx'
import PatrimonyChart from '@/routes/dashboard/patrimony-chart.tsx'

export default function Dashboard() {
  const { fullData } = useData()
  const [activeChart, setActiveChart] = useState<EntryRecords>('bricks')
  const newsFeed = useNewsFeed(3)
  const { investedAmount } = useData()

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-1">
        <div className="col-span-1 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between">
                <span>Patrimoine total</span>
                <FaPiggyBank />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <span className="text-2xl font-bold">
                {currencyFormatter.format(investedAmount)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between">
                <span>Diversification</span>
                <FaPiggyBank />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <span className="text-2xl font-bold">
                {Object.values(fullData).length}
              </span>
              <span className="text-muted-foreground text-sm">Investissements dans des actifs différents</span>
            </CardContent>
          </Card>
        </div>
        <PieChartRepartition />
        <div className="col-span-1 grid">
          <Card>
            <CardHeader>
              <CardTitle>Actualités</CardTitle>
              <CardDescription>Que s&apos;est-il passé récemment ?</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsList newsFeed={newsFeed} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Graphique</CardTitle>
            <CardDescription>
              Représentant l&apos;évolution de votre patrimoine par catégorie
            </CardDescription>
          </div>
          <div className="flex">
            <PatrimonySelect activeChart={activeChart} setActiveChart={setActiveChart} />
          </div>
        </CardHeader>
        <CardContent>
          <PatrimonyChart activeChart={activeChart} />
        </CardContent>
      </Card>
    </div>
  )
}
