import dataJson from '@/assets/patrimony.json'
import { Data } from '@/domain/models.ts'
import { RealEstateUtils } from '@/utils/real-estate.ts'

export const useRealEstate = () => {
  const { bricks } = dataJson as Data

  return {
    annuities: {
      lastUpdate: RealEstateUtils.annuities.lastUpdate(bricks.dividends),

      accumulatedAnnuities: RealEstateUtils.annuities.accumulatedAnnuities(bricks.dividends),

      netProfitability: RealEstateUtils.annuities.totalNetProfitability(bricks.dividends),
      totalTax: RealEstateUtils.annuities.totalTax(bricks.dividends),
      totalProfitability: RealEstateUtils.annuities.totalProfitability(bricks.dividends),

      chartData: RealEstateUtils.annuities.chartData(bricks.dividends),
    },

    investments: {
      lastUpdate: RealEstateUtils.lastUpdate(bricks.transactions),
      totalAmount: RealEstateUtils.totalAmount(bricks.transactions),
      investments: RealEstateUtils.investments(bricks.transactions),
      chartData: RealEstateUtils.chartData(bricks.transactions),
      mostValuable: RealEstateUtils.mostValuableInvestment(bricks.transactions),
    },
  }
}
