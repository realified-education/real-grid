import { Logger } from './logger'
import { GridElement } from './renderer/element'

export interface GridContext {
  isDebug?: boolean
  logger?: Logger
  columnContext?: ColumnContext[]
  rowsElement?: GridElement
  sortContext?: SortContext
}

export interface ColumnContext {
  position?: number
  actualWidth?: number
}

export interface SortContext {
  [key: string]: SortDirection
}

export enum SortDirection {
  Default = 0,
  Ascending = 1,
  Descending = 2,
}
