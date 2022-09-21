import { Columns } from './column.config'

export interface GridConfig<T> {
  data?: T[]
  columns?: Columns<T>
  bufferSize: number
}

export interface GridRenderConfig {
  container: HTMLElement | null
  disableStriped?: boolean
  rowHeight?: number
}

export interface Disposable {
  destroy: () => void
}
