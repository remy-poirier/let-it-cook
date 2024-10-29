import { CommonTransaction } from '@/routes/investments/investments.tsx'

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
}
