import { GridElement } from '../renderer/element'

export enum EventType {
  ON_RANGE_SELECTION_CHANGE = 'onRangeSelectionChange',
}

export interface RangeSelectionEvent {
  start: GridElement
  end: GridElement
}
