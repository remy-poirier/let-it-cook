import {
  CommonTransaction,
  Data, ETFDataEntry,
  ETFStatement,
  PEIDataEntry,
  RealEstateDataEntry,
  RealEstateDividend,
} from '@/domain/models.ts'
import { SavingsUtils } from '@/utils/savings.ts'
import { StockUtils } from '@/utils/stocks.ts'

type TransactionWithAccumulatedAmount = CommonTransaction & { accumulatedAmount: number }

export const TransactionsUtils = {
  totalValue: (transactions: CommonTransaction[]): number => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  },

  totalInvestmentPatrimony: (data: Data): number => {
    // Compute all transactions of all investments
    const bricksTotal = TransactionsUtils.totalValue(data.bricks.transactions)
    const epsorTotal = TransactionsUtils.totalValue(data.epsor.transactions)

    // New structure
    const savingsTotal = SavingsUtils.totalAmount(data.savings)
    const stocksTotal = StockUtils.totalInvestedAmount(data.stocks)

    return savingsTotal + bricksTotal + epsorTotal + stocksTotal
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

    profitabilityForDividendEntry: (dividendEntry: RealEstateDividend): number => {
      return dividendEntry.transactions
        .filter(transaction => transaction.value > 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },

    taxForDividendEntry: (dividendEntry: RealEstateDividend): number => {
      return dividendEntry.transactions
        .filter(transaction => transaction.value < 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },

    totalNetProfitabilityForDividendEntry: (dividendEntry: RealEstateDividend): number => {
      return TransactionsUtils.realEstate.profitabilityForDividendEntry(dividendEntry) + TransactionsUtils.realEstate.taxForDividendEntry(dividendEntry)
    },

    dividendsChart: (epsorData: RealEstateDataEntry) => {
      return epsorData.dividends.reduce((acc, dividend, index) => {
        let previousAmount = 0
        if (index > 0) {
          previousAmount = acc[index - 1].amount
        }
        acc.push({
          date: dividend.date,
          amount: TransactionsUtils.realEstate.profitabilityForDividendEntry(dividend) + TransactionsUtils.realEstate.taxForDividendEntry(dividend) + previousAmount,
        })

        return acc
      }, [] as { date: string, amount: number }[])
    },

    investmentRepartitions: (epsorData: RealEstateDataEntry) => {
      const allInvestments = epsorData.transactions.map(transaction => ({
        amount: transaction.amount,
        label: transaction.label,
      }))

      // For investments having the same label, we sum the amounts
      return allInvestments.reduce((acc, investment) => {
        const existingInvestment = acc.find(i => i.label === investment.label)
        if (existingInvestment) {
          existingInvestment.amount += investment.amount
        }
        else {
          acc.push(investment)
        }
        return acc
      }, [] as { amount: number, label: string }[])
    },

    sumInvestments: (epsorData: RealEstateDataEntry) => {
      return epsorData.transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
    },
  },

  epsor: {
    getLastStatement: (statements: ETFStatement[]): ETFStatement => {
      // Sort by date and keep the most recent one
      return statements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    },

    estimatedAmount: (entry: PEIDataEntry): number => {
      const totalValue = TransactionsUtils.totalValue(entry.transactions)
      const lastStatementRate = TransactionsUtils.epsor.getLastStatement(entry.statements).rate

      // Round to lower integer
      return Math.floor(totalValue * lastStatementRate / 100)
    },

    // This will add the last statement rate to the total value
    amountWithLastStatement: (entry: PEIDataEntry): number => {
      return TransactionsUtils.totalValue(entry.transactions) + TransactionsUtils.epsor.estimatedAmount(entry)
    },
  },

  pea: {
    totalInvested: (entries: ETFDataEntry): number => {
      const investments = entries.stock_market.investments
      return investments.reduce((acc, investment) => acc + investment.amount, 0)
    },
  },
}
