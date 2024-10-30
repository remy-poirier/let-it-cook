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

export interface BookletDataEntry extends CommonDataEntry<BookletTransaction> {
  kind: InvestmentKind.BOOKLET
  rate: number
}

export type RealEstateDividendTransaction = {
  label: string
  value: number
}

export type RealEstateDividend = {
  date: string
  transactions: RealEstateDividendTransaction[]
}

export type RealEstateDataEntry = CommonDataEntry<RealEstateTransaction> & {
  kind: InvestmentKind.REAL_ESTATE
  dividends: RealEstateDividend[]
}

export type ETFStatement = {
  date: string
  rate: number
}

export type ETFDataEntry = CommonDataEntry<CommonTransaction> & {
  kind: InvestmentKind.ETF
  employer_contribution: number
  statements: ETFStatement[]
}

export type PEIDataEntry = CommonDataEntry<CommonTransaction> & {
  kind: InvestmentKind.ETF
  employer_contribution: number
  statements: ETFStatement[]
}

export type DataEntry = BookletDataEntry | RealEstateDataEntry | ETFDataEntry

export type EntryRecords = 'ldds_credit_agricole' | 'bricks' | 'epsor'

export type EntryRecordsMapping = {
  ldds_credit_agricole: BookletDataEntry
  bricks: RealEstateDataEntry
  epsor: PEIDataEntry
}

export type Data = {
  [K in keyof EntryRecordsMapping]: EntryRecordsMapping[K]
}
