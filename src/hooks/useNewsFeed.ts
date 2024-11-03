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
    // Add each transaction of saving with title Account label and description label of transaction
    data.savings.forEach((saving) => {
      saving.accounts.forEach((account) => {
        account.transactions.forEach((transaction) => {
          newsFeed.push({
            kind: 'INVESTMENT',
            label: account.label,
            description: transaction.label,
            amount: transaction.amount,
            date: transaction.date,
            iconMapping: 'saving-investment',
          })
        })
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
          iconMapping: 'real-estate-investment',
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
          iconMapping: 'epsor-investment',
        })
      })

    for (const stock of data.stocks) {
      for (const investment of stock.investments) {
        newsFeed.push({
          kind: 'INVESTMENT',
          label: stock.label,
          description: investment.label,
          amount: investment.amount,
          date: investment.date,
          iconMapping: 'stock-investment',
        })
      }

      for (const transaction of stock.transactions) {
        const fund = stock.funds[transaction.fund_id]
        newsFeed.push({
          kind: 'INVESTMENT',
          label: stock.label,
          description: fund.label,
          amount: transaction.cost_price * transaction.quantity,
          date: transaction.date,
          iconMapping: 'stock-purchase',
        })
      }
    }
  }

  if (!kind || kind === 'DIVIDEND') {
    data.bricks
      .dividends.forEach((dividend) => {
        const totalDividend = TransactionsUtils.realEstate.totalNetProfitabilityForDividendEntry(dividend)
        const tax = TransactionsUtils.realEstate.taxForDividendEntry(dividend)
        newsFeed.push({
          kind: 'DIVIDEND',
          label: 'Rente',
          description: `Fiscalité déduite: ${currencyFormatter.format(Math.abs(tax))}`,
          amount: totalDividend,
          date: dividend.date,
          iconMapping: 'real-estate-dividend',
        })
      })
  }

  if (!kind || kind === 'INFO') {
    data.epsor.statements.forEach((statement) => {
      newsFeed.push({
        kind: 'INFO',
        label: 'Epsor',
        description: 'Valorisation du compte à date',
        amount: statement.rate,
        date: statement.date,
        iconMapping: 'info',
      })
    })
  }

  // Sort them by date, form the most recent to the oldest
  newsFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return newsFeed.slice(0, nbToKeep ?? newsFeed.length)
}
