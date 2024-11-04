import dataJson from '@/assets/patrimony.json'
import { Data } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'

export const useEmployeeSavings = () => {
  const { epsor } = dataJson as Data

  const lastUpdate = epsor.transactions[epsor.transactions.length - 1].date

  return {
    lastUpdate,

    totalAmount: TransactionsUtils.epsor.amountWithLastStatement(epsor),

    chartData: TransactionsUtils.accumulate(epsor.transactions)
      .map(t => ({
        ...t,
        amount: t.accumulatedAmount,
      })),

    accounts: [epsor],

    // For now we only have one account so let's keep it simple
    amountForAccount: TransactionsUtils.epsor.amountWithLastStatement(epsor),
    transactions: TransactionsUtils.epsor.transactionsFromMostRecentToOldest(epsor),
  }
}
