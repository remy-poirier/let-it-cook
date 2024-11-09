import dataJson from '@/assets/patrimony.json'
import { Data, SavingAccount, SavingsDataEntry } from '@/domain/models.ts'
import { SavingsUtils } from '@/utils/savings.ts'

export const useSavings = () => {
  const { savings } = dataJson as Data

  return {
    savings,

    totalAmount: savings.reduce((acc, saving) => {
      return acc + SavingsUtils.savingAmount(saving)
    }, 0),

    totalAmountForSaving: (saving: SavingsDataEntry) => SavingsUtils.savingAmount(saving),

    amountForAccount: (account: SavingAccount) => SavingsUtils.accountAmount(account),
    completionPercentForAccount: (account: SavingAccount) => {
      const maxAmount = account.maxAmount
      const accountAmount = SavingsUtils.accountAmount(account)

      return (accountAmount / maxAmount) * 100
    },

    lastSavingUpdate: SavingsUtils.lastSavingUpdate(savings),

    chartData: SavingsUtils.chartData(savings),
  }
}
