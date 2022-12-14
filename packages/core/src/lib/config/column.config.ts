import { DataKey } from '../renderer/types'
import { SortDirection } from './context'

export type ColumnSortParams<T, K extends DataKey<T>> = {
  config: Column<T, K>
  row: T
  data: T[K]
}

export type ColumnSortFunction<T, K extends DataKey<T>> = (
  a: ColumnSortParams<T, K>,
  b: ColumnSortParams<T, K>,
  direction: SortDirection
) => number

export type ColumnType = 'string' | 'number' | 'date' | 'boolean'

/**
 * Used to pass in types for the column config
 */
type KeyValueFunc<T> = {
  [K in DataKey<T>]-?: Column<T, K>
}[DataKey<T>]

export type Columns<T> = KeyValueFunc<T>[]

export type Column<T, K extends DataKey<T>> = {
  key: K
  label?: string
  width?: number
  sortDirection?: SortDirection
  sortFunction?: ColumnSortFunction<T, K>
  valueGetter?: ValueGetterFunction<T, K>
  type?: ColumnType
}

/**
 * Used to format the value of a column
 * 
 * Usage:
 *  { key: 'revenue', label: 'Revenue', width: 100, valueGetter: (row) => `$${row.toFixed(2)}` }
 */
export type ValueGetterFunction<T, K extends DataKey<T>> = (
  data: T[K]
) => string
