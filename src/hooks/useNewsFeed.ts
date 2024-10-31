import dataJson from '@/assets/patrimony.json'
import { Data, NewsFeedEntry } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { currencyFormatter } from '@/utils/formatters.ts'

export const useNewsFeed = (
  nbToKeep?: number,
  kind?: NewsFeedEntry['kind'],
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

    data.pea
      .transactions.forEach((transaction) => {
        newsFeed.push({
          kind: 'INVESTMENT',
          label: 'PEA',
          description: transaction.label,
          amount: transaction.amount,
          date: transaction.date,
        })
      })

    data.pea.stock_market.investments.forEach((transaction) => {
      newsFeed.push({
        kind: 'INVESTMENT',
        label: 'Achat d\'actions',
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

  if (!kind || kind === 'INFO') {
    data.pea.stock_market.statements.forEach((statement) => {
      newsFeed.push({
        kind: 'INFO',
        label: 'Valorisation PEA',
        description: statement.label,
        amount: statement.amount,
        date: statement.date,
      })
    })

    data.epsor.statements.forEach((statement) => {
      newsFeed.push({
        kind: 'INFO',
        label: 'Epsor',
        description: 'Valorisation du compte à date',
        amount: statement.rate,
        date: statement.date,
      })
    })
  }

  // Sort them by date, form the most recent to the oldest
  newsFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return newsFeed.slice(0, nbToKeep ?? newsFeed.length)
}
