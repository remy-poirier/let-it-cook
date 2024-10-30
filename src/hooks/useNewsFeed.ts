import dataJson from '@/assets/patrimony.json'
import { Data } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'

interface NewsFeedEntry {
  kind: 'INVESTMENT' | 'DIVIDEND'
  date: string
  label: string
  description: string
  amount: number
}

export const useNewsFeed = (
  nbToKeep?: number,
  kind?: 'INVESTMENT' | 'DIVIDEND',
) => {
  const data = dataJson as Data

  const newsFeed: NewsFeedEntry[] = []

  if (!kind || kind === 'INVESTMENT') {
    data.ldds_credit_agricole
      .transactions.forEach((transaction) => {
        newsFeed.push({
          kind: 'INVESTMENT',
          label: 'LDD Solidaire Crédit Agricole',
          description: transaction.label,
          amount: transaction.amount,
          date: transaction.date,
        })
      })

    data.bricks
      .transactions.forEach((transaction) => {
        newsFeed.push({
          kind: 'INVESTMENT',
          label: 'Bricks',
          description: transaction.label,
          amount: transaction.amount,
          date: transaction.date,
        })
      })

    data.epsor
      .transactions.forEach((transaction) => {
        newsFeed.push({
          kind: 'INVESTMENT',
          label: 'Epsor',
          description: transaction.label,
          amount: transaction.amount,
          date: transaction.date,
        })
      })
  }

  if (!kind || kind === 'DIVIDEND') {
    data.bricks
      .dividends.forEach((dividend) => {
        const totalDividend = TransactionsUtils.realEstate.totalNetProfitabilityForDividendEntry(dividend)
        const tax = TransactionsUtils.realEstate.taxForDividendEntry(dividend)
        newsFeed.push({
          kind: 'DIVIDEND',
          label: 'Bricks',
          description: `Fiscalité déduite: ${currencyFormatter.format(Math.abs(tax))}`,
          amount: totalDividend,
          date: dividend.date,
        })
      })
  }

  // Sort them by date, form the most recent to the oldest
  newsFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return newsFeed.slice(0, nbToKeep ?? newsFeed.length)
}
