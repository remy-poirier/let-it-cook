import dataJson from '@/assets/patrimony.json'
import { Data, StocksDataEntry } from '@/domain/models.ts'
import { StockUtils } from '@/utils/stocks.ts'

export const useStocks = () => {
  const { stocks } = dataJson as Data

  return {
    lastUpdate: StockUtils.lastUpdate(stocks),
    totalAmountInvested: StockUtils.totalInvestment(stocks),

    chartData: StockUtils.chartData(stocks),

    stocks,

    totalValueForStock: (stock: StocksDataEntry) => StockUtils.totalValueForStock(stock),

    quantityOfFundId: (stock: StocksDataEntry, fundId: string) => StockUtils.quantityOfFundId(stock, fundId),
    costPriceOfFundId: (stock: StocksDataEntry, fundId: string) => StockUtils.costPriceOfFundId(stock, fundId),
    capitalGain: (stock: StocksDataEntry, fundId: string, currentAmount: number) => StockUtils.capitalGain(stock, fundId, currentAmount),
    getCurrentStateOfFund: (stock: StocksDataEntry, fundId: string) => StockUtils.getCurrentStateOfFund(stock, fundId),
  }
}
