import dataJson from '@/assets/patrimony.json'
import { Data } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'

export const useData = () => {
  const data = dataJson as Data

  return {
    fullData: data,
    ldds_credit_agricole: data.ldds_credit_agricole,
    bricksData: data.bricks,
    epsor: data.epsor,
    investedAmount: TransactionsUtils.totalInvestmentPatrimony(data),
  }
}

export const useEpsor = () => {
  const { epsor } = useData()

  return {
    lastStatement: TransactionsUtils.epsor.getLastStatement(epsor.statements),
    estimatedAmount: TransactionsUtils.epsor.estimatedAmount(epsor),
    amountWithLastStatement: TransactionsUtils.epsor.amountWithLastStatement(epsor),
  }
}
