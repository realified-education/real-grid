import { EventHub } from '../events/events-hub'
import { Logger } from '../logger'
import { GridElement } from '../renderer/element'
import { RowRenderer } from '../renderer/row.renderer'

export interface GridContext {
  isDebug?: boolean
  logger?: Logger
  columnContext?: ColumnContext[]
  rowsElement?: GridElement
  sortContext?: SortContext
  renderContext?: RenderContext
  selectedRows?: Set<GridElement>
  rangeSelection?: RangeSelection
  cellSelection?: CellRangeSelection
  allRowRenders?: RowRenderer<unknown>[]

  eventHub?: EventHub
}

export interface ColumnContext {
  position?: number
  actualWidth?: number
}

export interface SortContext {
  [key: string]: SortDirection
}

export enum SortDirection {
  Default = 'default',
  Ascending = 'asc',
  Descending = 'desc',
}

export interface RenderContext {
  renderedRows?: number
  topRowInViewport?: number
  bottomRowInViewport?: number
}

export interface RangeSelection {
  start?: GridElement
  end?: GridElement
}

export interface CellRangeSelection extends RangeSelection {
  mouseDown?: boolean
}

