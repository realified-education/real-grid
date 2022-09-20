import { Columns } from './column.config'

export interface GridConfig<T> {
  data?: T[]
  columns?: Columns<T>
}

export interface GridRenderConfig {
  container: HTMLElement | null
}

export interface Disposable {
  destroy: () => void
}
