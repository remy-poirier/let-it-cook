import { CommonTransaction, SavingAccount, SavingsDataEntry } from '@/domain/models.ts'

export const SavingsUtils = {

  totalAmount: (savings: SavingsDataEntry[]) => {
    return savings.reduce((acc, saving) => acc + SavingsUtils.savingAmount(saving), 0)
  },

  savingAmount: (saving: SavingsDataEntry) => {
    return saving.accounts.reduce((acc, account) => acc + SavingsUtils.accountAmount(account), 0)
  },

  accountAmount: (account: SavingAccount) => {
    return account.transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  },

  lastSavingUpdate: (savings: SavingsDataEntry[]) => {
    return savings.reduce((acc, saving) => {
      const lastUpdate = saving.accounts.reduce((acc, account) => {
        const lastTransaction = account.transactions.reduce((acc, transaction) => {
          return transaction.date > acc ? transaction.date : acc
        }, '')
        return lastTransaction > acc ? lastTransaction : acc
      }, '')
      return lastUpdate > acc ? lastUpdate : acc
    }, '')
  },

  chartData: (savings: SavingsDataEntry[]) => {
    const transactions = savings.map(saving => saving.accounts.map(account => account.transactions)).flat().flat()
    const sortedTransactions = transactions.sort((a, b) => a.date.localeCompare(b.date))

    const groupedTransactions = sortedTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.date]) {
        acc[transaction.date] = []
      }
      acc[transaction.date].push(transaction)
      return acc
    }, {} as Record<string, CommonTransaction[]>)

    return Object.entries(groupedTransactions).reduce((acc, [date, transactions]) => {
      const amount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
      const previousAmount = acc.length > 0 ? acc[acc.length - 1].amount : 0
      acc.push({
        date,
        amount: amount + previousAmount,
      })
      return acc
    }, [] as { date: string, amount: number }[])
  },
}
