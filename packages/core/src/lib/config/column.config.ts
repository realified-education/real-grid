import { SortDirection } from '../context'

export type ColumnSortParams<T, K extends keyof T> = {
  config: Column<T, K>
  row: T
  data: T[K]
}

export type ColumnSortFunction<T, K extends keyof T> = (
  a: ColumnSortParams<T, K>,
  b: ColumnSortParams<T, K>,
  direction: SortDirection
) => number

export type ColumnType = 'string' | 'number' | 'date' | 'boolean'

/**
 * Used to pass in types for the column config
 */
type KeyValueFunc<T> = {
  [K in keyof T]-?: Column<T, K>
}[keyof T]

export type Columns<T> = KeyValueFunc<T>[]

export type Column<T, K extends keyof T> = {
  key: K
  label?: string
  width?: number
  sortDirection?: SortDirection
  sortFunction?: ColumnSortFunction<T, K>
  valueGetter?: ValueGetterFunction<T, K>
  type?: ColumnType
}

export type ValueGetterFunction<T, K extends keyof T> = (data: T[K]) => string
