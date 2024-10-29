import dataJson from '@/assets/patrimony.json'

export enum InvestmentKind {
  BOOKLET = 'BOOKLET',
  REAL_ESTATE = 'REAL_ESTATE',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
}

interface CommonDataEntry<T> {
  id: string
  label: string
  transactions: T[]
}

export interface CommonTransaction {
  date: string
  amount: number
  label: string
}

type BookletTransaction = CommonTransaction
export type RealEstateTransaction = CommonTransaction & { profitability: number }

interface BookletDataEntry extends CommonDataEntry<BookletTransaction> {
  kind: InvestmentKind.BOOKLET
  rate: number
}

export type RealEstateDataEntry = CommonDataEntry<RealEstateTransaction> & {
  kind: InvestmentKind.REAL_ESTATE
  dividends: {
    date: string
    transactions: {
      label: string
      value: number
    }[]
  }[]
}
type ETFDataEntry = CommonDataEntry<CommonTransaction> & {
  kind: InvestmentKind.ETF
}

export type DataEntry = BookletDataEntry | RealEstateDataEntry | ETFDataEntry

type EntryRecords = 'ldds_credit_agricole' | 'bricks' | 'epsor'

type Data = Record<EntryRecords, DataEntry>

export const useData = () => {
  const data = dataJson as Data

  return {
    fullData: data,
    ldds_credit_agricole: data.ldds_credit_agricole as BookletDataEntry,
    bricksData: data.bricks as RealEstateDataEntry,
    epsor: data.epsor as ETFDataEntry,
  }
}
