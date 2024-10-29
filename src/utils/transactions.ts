import { CommonTransaction } from '@/routes/investments/investments.tsx'
import { RealEstateDataEntry } from '@/hooks/useData.ts'

type TransactionWithAccumulatedAmount = CommonTransaction & { accumulatedAmount: number }

export const TransactionsUtils = {
  totalValue: (transactions: CommonTransaction[]): number => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  },

  accumulate: (transactions: CommonTransaction[]): TransactionWithAccumulatedAmount[] => {
    return transactions.reduce((acc, transaction, index) => {
      const accumulatedAmount = acc[index - 1]?.accumulatedAmount ?? 0
      const newAccumulatedAmount = accumulatedAmount + transaction.amount

      return [...acc, { ...transaction, accumulatedAmount: newAccumulatedAmount }]
    }, [] as TransactionWithAccumulatedAmount[])
  },

  realEstate: {
    totalProfitability: (dividends: RealEstateDataEntry): number => {
      // This will filter all positive dividends and sums them
      return dividends.dividends
        .map(dividend => dividend.transactions)
        .flat()
        .filter(transaction => transaction.value > 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },
    totalTax: (dividends: RealEstateDataEntry): number => {
      // This will filter all negative dividends and sums them
      return dividends.dividends
        .map(dividend => dividend.transactions)
        .flat()
        .filter(transaction => transaction.value < 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },
    totalNetProfitability: (transactions: RealEstateDataEntry): number => {
      return TransactionsUtils.realEstate.totalProfitability(transactions) + TransactionsUtils.realEstate.totalTax(transactions)
    },
  },
}
