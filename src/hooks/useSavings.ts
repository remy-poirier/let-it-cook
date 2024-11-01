import dataJson from '@/assets/patrimony.json'
import { Data, SavingAccount, SavingsDataEntry } from '@/domain/models.ts'
import { SavingsUtils } from '@/utils/savings.ts'

export const useSavings = () => {
  const { savings } = dataJson as Data

  console.log(savings)
  return {
    savings,

    totalAmount: savings.reduce((acc, saving) => {
      return acc + SavingsUtils.savingAmount(saving)
    }, 0),

    totalAmountForSaving: (saving: SavingsDataEntry) => SavingsUtils.savingAmount(saving),

    amountForAccount: (account: SavingAccount) => SavingsUtils.accountAmount(account),

    lastSavingUpdate: SavingsUtils.lastSavingUpdate(savings),

    chartData: SavingsUtils.chartData(savings),
  }
}
