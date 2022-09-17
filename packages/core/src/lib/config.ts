export interface GridConfig<T> {
  data?: T[]
  columns?: Column[]
}

export interface GridRenderConfig {
  container: HTMLElement | null
}

export interface Disposable {
  destroy: () => void
}

export type Column = {
  key: string
  label?: string
  width?: number
}
