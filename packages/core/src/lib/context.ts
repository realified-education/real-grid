import { Logger } from './logger'

export interface GridContext {
  isDebug?: boolean
  logger?: Logger
  columnContext?: ColumnContext[]
}

export interface ColumnContext {
  position?: number
  actualWidth?: number
}
