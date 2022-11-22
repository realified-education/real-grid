import { GridElement } from '../renderer/element'

export enum EventType {
  ON_RANGE_SELECTION_CHANGE = 'onRangeSelectionChange',
  ON_CELL_SELECTION_CHANGE = 'onCellSelectionChange',
  CLEAR_CELL_CLASS = 'clearCellClass',
}

export interface RangeSelectionEvent {
  start: GridElement
  end: GridElement
}

export interface CellSelectionEvent {
  start: GridElement
  end: GridElement
  startRow: GridElement
  endRow: GridElement
}