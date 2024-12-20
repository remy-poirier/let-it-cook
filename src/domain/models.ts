export enum InvestmentKind {
  REAL_ESTATE = 'REAL_ESTATE',
  ETF = 'ETF',
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

export type RealEstateTransaction = CommonTransaction & {
  profitability: number
  duration: number
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

export type PEIDataEntry = CommonDataEntry<CommonTransaction> & {
  kind: InvestmentKind.ETF
  employer_contribution: number
  organism: string
  statements: ETFStatement[]
}

export type EntryRecords = 'bricks' | 'epsor' | 'savings' | 'stocks'

export type SavingsDataEntry = {
  label: string
  iconUrl: string
  accounts: SavingAccount[]
}

export type SavingAccount = {
  label: string
  transactions: CommonTransaction[]
  rate: number
  maxAmount: number
}

export type StockFund = {
  label: string
  country: string
  bank: string
  current_state: StockFluctuation
  fluctuations: StockFluctuation[]
  cost_price: number
}

export type StockFluctuation = {
  date: string
  amount: number
}

export type StockTransactions = {
  fund_id: string
  quantity: number
  cost_price: number
  date: string
}

export type StocksDataEntry = {
  label: string
  bank: string
  funds: Record<string, StockFund>
  transactions: StockTransactions[]
  investments: CommonTransaction[]
}

export type EntryRecordsMapping = {
  bricks: RealEstateDataEntry
  epsor: PEIDataEntry
  savings: SavingsDataEntry[]
  stocks: StocksDataEntry[]
}

export type Data = {
  [K in keyof EntryRecordsMapping]: EntryRecordsMapping[K]
}

export interface NewsFeedEntry {
  kind: 'INVESTMENT' | 'DIVIDEND' | 'INFO'
  date: string
  label: string
  description: string
  amount: number
  iconMapping: string
}
