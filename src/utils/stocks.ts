import { StocksDataEntry } from '@/domain/models.ts'

export const StockUtils = {
  lastUpdate: (stocks: StocksDataEntry[]) => {
    // flat all stocks transactions and get most recent date
    const transactionDates = stocks.map(stock => stock.transactions.map(transaction => transaction.date)).flat()
    const fundsCurrentStateDates = stocks.map(stock => Object.values(stock.funds).map(fund => fund.current_state.date)).flat()
    const sortedTransactions = [...transactionDates, ...fundsCurrentStateDates].sort((a, b) => a.localeCompare(b))
    return sortedTransactions[sortedTransactions.length - 1]
  },

  transactionsWithCurrentPrice: (stocks: StocksDataEntry[]) => {
    return stocks.map((stock) => {
      return stock.transactions.map((transaction) => {
        return {
          ...transaction,
          current_price: stock.funds[transaction.fund_id].current_state.amount,
        }
      })
    }).flat()
  },

  totalInvestment: (stocks: StocksDataEntry[], lastValue?: number) => {
    const transactions = StockUtils.transactionsWithCurrentPrice(stocks)

    return transactions.reduce((acc, transaction) => {
      if (lastValue) {
        return acc + (transaction.quantity * lastValue)
      }
      return acc + (transaction.quantity * transaction.cost_price)
    }, 0)
  },

  totalInvestedAmount: (stocks: StocksDataEntry[]) => {
    const transactions = stocks.map(stock => stock.investments).flat()
    // sum all amounts
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
  },

  chartData: (stocks: StocksDataEntry[], lastValue?: number) => {
    const transactions = StockUtils
      .transactionsWithCurrentPrice(stocks)
      .map(transaction => ({
        ...transaction,
        amount: lastValue ? transaction.quantity * lastValue : transaction.quantity * transaction.cost_price,
      }))
      .reduce((acc, transaction) => {
        const previousAmount = acc.length > 0 ? acc[acc.length - 1].amount : 0
        acc.push({
          date: transaction.date,
          amount: transaction.amount + previousAmount,
        })
        return acc
      }, [] as { date: string, amount: number }[])

    return transactions
  },

  investmentChartData: (stocks: StocksDataEntry[]) => {
    const transactions = stocks.map(stock => stock.investments).flat()
    const sortedTransactions = [...transactions].sort((a, b) => a.date.localeCompare(b.date))

    return sortedTransactions.reduce((acc, transaction) => {
      const previousAmount = acc.length > 0 ? acc[acc.length - 1].amount : 0
      acc.push({
        date: transaction.date,
        amount: transaction.amount + previousAmount,
      })
      return acc
    }, [] as { date: string, amount: number }[])
  },

  totalValueForStock: (stock: StocksDataEntry, currentEtfPrice?: number) => {
    return stock.transactions.reduce((acc, transaction) => {
      const transactionPrice = currentEtfPrice ? transaction.quantity * currentEtfPrice : transaction.quantity * transaction.cost_price
      return acc + transactionPrice
    }, 0)
  },

  quantityOfFundId: (stock: StocksDataEntry, fundId: string) => {
    return stock.transactions.reduce((acc, transaction) => {
      if (transaction.fund_id === fundId) {
        return acc + transaction.quantity
      }
      return acc
    }, 0)
  },

  /**
	 * [ATTENTION POINT HERE] For this, I don't know if the value is rounded after each transactions or unique
	 * For what I see online, it seems to be rounded so we have only 1 value for the cost price of a fund
	 * TODO check next month after investment, if it's the case, we should move cost_price to the fund directly
	 */
  costPriceOfFundId: (stock: StocksDataEntry, fundId: string) => {
    // get 1st transaction of the fund and returns its cost price
    const fund = stock.funds[fundId]
    return fund.cost_price
  },

  capitalGain: (stock: StocksDataEntry, fundId: string, currentPrice: number) => {
    const quantity = StockUtils.quantityOfFundId(stock, fundId)
    const costPrice = StockUtils.costPriceOfFundId(stock, fundId) * quantity
    const actualPrice = currentPrice * quantity
    // This should return an object with amount and percentage
    const amount = actualPrice - costPrice
    const percentage = (amount / costPrice) * 100
    return { amount, percentage }
  },

  getCurrentStateOfFund: (stock: StocksDataEntry, fundId: string) => {
    const fund = stock.funds[fundId]
    const sortedFluctuations = [...fund.fluctuations].sort((a, b) => a.date.localeCompare(b.date))
    return sortedFluctuations[sortedFluctuations.length - 1]
  },

}
