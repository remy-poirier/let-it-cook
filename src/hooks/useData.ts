import dataJson from '@/assets/patrimony.json'
import { Data } from '@/domain/models.ts'
import { TransactionsUtils } from '@/utils/transactions.ts'

export const useData = () => {
  const data = dataJson as Data

  // Create object with everything except the savings
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { savings, ...dataWithoutSavings } = data

  return {
    fullData: dataWithoutSavings,
    ldds_credit_agricole: data.ldds_credit_agricole,
    bricksData: data.bricks,
    epsor: data.epsor,
    pea: data.pea,

    investedAmount: TransactionsUtils.totalInvestmentPatrimony(data),

    accumulatedTransactions: {
      epsor: TransactionsUtils.accumulate(data.epsor.transactions),
      bricks: TransactionsUtils.accumulate(data.bricks.transactions),
      ldds_credit_agricole: TransactionsUtils.accumulate(data.ldds_credit_agricole.transactions),
      pea: TransactionsUtils.accumulate(data.pea.transactions),
    },

    bricks: {
      dividendsChart: TransactionsUtils.realEstate.dividendsChart(data.bricks),
      investments: TransactionsUtils.realEstate.investmentRepartitions(data.bricks),
      sumInvestments: TransactionsUtils.realEstate.sumInvestments(data.bricks),
    },
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

export const usePEA = () => {
  const { pea } = useData()

  return {
    totalInvested: TransactionsUtils.pea.totalInvested(pea),
  }
}
