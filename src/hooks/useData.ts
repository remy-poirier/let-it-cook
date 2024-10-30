import dataJson from '@/assets/patrimony.json'
import { BookletDataEntry, Data, ETFDataEntry, RealEstateDataEntry } from '@/domain/models.ts'

export const useData = () => {
  const data = dataJson as Data

  return {
    fullData: data,
    ldds_credit_agricole: data.ldds_credit_agricole as BookletDataEntry,
    bricksData: data.bricks as RealEstateDataEntry,
    epsor: data.epsor as ETFDataEntry,
  }
}
