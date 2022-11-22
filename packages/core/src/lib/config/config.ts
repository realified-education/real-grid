import { Columns } from './column.config'

export interface GridConfig<T> {
  data?: T[]
  columns?: Columns<T>
  bufferSize: number
  rowSelection?: boolean
  multiRowSelection?: boolean
  enableCellSelection?: boolean
}

export interface GridRenderConfig {
  container: HTMLElement | null
  disableStriped?: boolean
  rowHeight?: number
}

export interface Disposable {
  destroy: () => void
}

export const EMPTY_DISPOSABLE: Disposable = {
  destroy: () => {
    // do nothing
  },
}
