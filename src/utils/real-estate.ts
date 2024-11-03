import { RealEstateDividend, RealEstateTransaction } from '@/domain/models.ts'

export const RealEstateUtils = {
  lastUpdate: (transactions: RealEstateTransaction[]) => {
    // Sort by date and keep most recent
    const sortedTransactions = transactions.sort((a, b) => a.date.localeCompare(b.date))
    return sortedTransactions[sortedTransactions.length - 1].date
  },

  totalAmount: (transactions: RealEstateTransaction[]) => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  },

  investments: (transactions: RealEstateTransaction[]) => {
    // return new array sorted by date, we new a new reference array to avoid mutating the original one
    const investments = [...transactions]
    return investments.sort((a, b) => b.date.localeCompare(a.date))
  },

  chartData: (transactions: RealEstateTransaction[]) => {
    const investments = [...transactions].sort((a, b) => a.date.localeCompare(b.date))

    return investments.reduce((acc, transaction) => {
      const previousAmount = acc.length > 0 ? acc[acc.length - 1].amount : 0
      acc.push({
        ...transaction,
        date: transaction.date,
        amount: transaction.amount + previousAmount,
      })
      return acc
    }, [] as { date: string, amount: number }[])
  },

  annuities: {
    lastUpdate: (dividends: RealEstateDividend[]) => {
      const sortedDividends = dividends.sort((a, b) => a.date.localeCompare(b.date))
      return sortedDividends[sortedDividends.length - 1].date
    },

    totalProfitability: (dividends: RealEstateDividend[]): number => {
      // This will filter all positive dividends and sums them
      return dividends
        .map(dividend => dividend.transactions)
        .flat()
        .filter(transaction => transaction.value > 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },
    totalTax: (dividends: RealEstateDividend[]): number => {
      // This will filter all negative dividends and sums them
      return dividends
        .map(dividend => dividend.transactions)
        .flat()
        .filter(transaction => transaction.value < 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },
    totalNetProfitability: (transactions: RealEstateDividend[]): number => {
      return RealEstateUtils.annuities.totalProfitability(transactions) + RealEstateUtils.annuities.totalTax(transactions)
    },

    profitabilityForDividend: (dividend: RealEstateDividend): number => {
      return dividend.transactions
        .filter(transaction => transaction.value > 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },

    taxForDividend: (dividend: RealEstateDividend): number => {
      return dividend.transactions
        .filter(transaction => transaction.value < 0)
        .reduce((acc, transaction) => acc + transaction.value, 0)
    },

    chartData: (dividends: RealEstateDividend[]) => {
      return dividends.reduce((acc, dividend, index) => {
        let previousAmount = 0
        if (index > 0) {
          previousAmount = acc[index - 1].amount
        }
        acc.push({
          date: dividend.date,
          amount: RealEstateUtils.annuities.profitabilityForDividend(dividend) + RealEstateUtils.annuities.taxForDividend(dividend) + previousAmount,
        })

        return acc
      }, [] as { date: string, amount: number }[])
    },

    accumulatedAnnuities: (dividends: RealEstateDividend[]) => {
      const dividendsByLabel = dividends.reduce((acc, dividend) => {
        dividend.transactions.forEach((transaction) => {
          if (!acc[transaction.label]) {
            acc[transaction.label] = 0
          }
          acc[transaction.label] += transaction.value
        })
        return acc
      }, {} as Record<string, number>)

      return Object.entries(dividendsByLabel)
        .filter(([, amount]) => amount > 0)
        .map(([label, amount]) => {
          return {
            label,
            amount: amount,
          }
        })
    },
  },
}
