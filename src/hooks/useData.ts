import dataJson from '@/assets/patrimony.json'
import { Data, EntryRecords } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'
import { SavingsUtils } from '@/utils/savings.ts'
import { StockUtils } from '@/utils/stocks.ts'

export const useData = () => {
  const data = dataJson as Data

  // Create object with everything except the savings

  return {
    pieChartData: {
      stocks: StockUtils.totalInvestedAmount(data.stocks),
      savings: SavingsUtils.totalAmount(data.savings),
      bricks: TransactionsUtils.totalValue(data.bricks.transactions),
      epsor: TransactionsUtils.totalValue(data.epsor.transactions),
    },
    fullData: data,
    bricksData: data.bricks,
    epsor: data.epsor,
    savings: data.savings,

    chartData: {
      label: (key: EntryRecords) => {
        switch (key) {
          case 'savings':
            return data.savings.map(saving => saving.label)
          case 'stocks':
            return 'PEA'
          case 'bricks':
            return 'Immobilier'
          case 'epsor':
            return 'Épargne salariale'
          default:
            return 'A implémenter'
        }
      },
      amount: (key: EntryRecords) => {
        switch (key) {
          case 'savings':
            return SavingsUtils.totalAmount(data.savings)
          case 'stocks':
            return StockUtils.totalInvestedAmount(data.stocks)
          case 'bricks':
          case 'epsor':
            return TransactionsUtils.totalValue(data[key].transactions)
          default:
            return 0
        }
      },
    },

    investedAmount: TransactionsUtils.totalInvestmentPatrimony(data),

    accumulatedTransactions: {
      epsor: TransactionsUtils.accumulate(data.epsor.transactions),
      bricks: TransactionsUtils.accumulate(data.bricks.transactions),

      savings: SavingsUtils.chartData(data.savings).map(entry => ({
        ...entry,
        accumulatedAmount: entry.amount,
      })),
      stocks: StockUtils.investmentChartData(data.stocks)
        .map(entry => ({
          ...entry,
          accumulatedAmount: entry.amount,
        })),
    },

    bricks: {
      dividendsChart: TransactionsUtils.realEstate.dividendsChart(data.bricks),
      investments: TransactionsUtils.realEstate.investmentRepartitions(data.bricks),
      sumInvestments: TransactionsUtils.realEstate.sumInvestments(data.bricks),
    },
  }
}
