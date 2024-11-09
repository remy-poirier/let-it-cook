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

  mostValuableInvestment: (transactions: RealEstateTransaction[]) => {
    /**
		 * We have to take several things in consideration here:
		 * - Total amount invested
		 * - profitability
		 * - duration (in months)
		 *
		 * With these 3 infos we can calculate the total profitability,
		 * we can return an array sorted from the most profitable to the least
		 * which contains an object containing
		 * - amount
		 * - tax
		 */

    const investments = RealEstateUtils.investments(transactions)
    const mostValuableInvestment = [...investments].reduce((acc, investment) => {
      const profitability = investment.profitability
      const duration = investment.duration

      /**
			 * Total profitability is in reality total amount received, it should be the sum of all amounts received, which means
			 * for an investment of 100€ with 10 profitability on 12 months,
			 * which means 10% on the year, anyway the result should be does 0.83€ per month and we then
			 * which we can multiply by the duration to get the total profitability
			 */
      const totalGrossProfitability = profitability / 100 * investment.amount / 12 * duration
      const taxAmount = totalGrossProfitability * 0.3

      acc.push({
        amount: investment.amount,
        grossProfitability: totalGrossProfitability,
        tax: taxAmount,
        netProfitability: totalGrossProfitability - taxAmount,
        label: investment.label,
      })
      return acc
    }, [] as { amount: number, grossProfitability: number, tax: number, netProfitability: number, label: string }[])

    const sortedInvestments = mostValuableInvestment.sort((a, b) => b.grossProfitability - a.grossProfitability)
    // keep only the 3 most valuable investments
    return sortedInvestments.slice(0, 3)
  },
}
