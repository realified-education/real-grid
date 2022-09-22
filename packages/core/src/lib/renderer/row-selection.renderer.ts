import { Disposable, EMPTY_DISPOSABLE, GridConfig } from '../config'
import { GridContext } from '../context'
import { EventType, RangeSelectionEvent } from '../events/event-types'
import { GridElement } from './element'

export function renderRowSelection<T>(
  rowElement: GridElement,
  config: GridConfig<T> & GridContext
): Disposable {
  if (!config.rowSelection) {
    return EMPTY_DISPOSABLE
  }

  const listener = rowElement.addEventListener('click', (e) => {
    const event = e as KeyboardEvent

    if (config.multiRowSelection) {
      setMultiSelection(config, rowElement)
    } else {
      setSingleSelection(config, rowElement)
    }

    setRangeSelection(config, rowElement, event.shiftKey)
  })

  return listener
}

/**
 * Sets the range selection start into the context
 */
function setRangeSelection(
  config: GridContext,
  rowElement: GridElement,
  shiftKey: boolean
) {
  if (!config.rangeSelection) {
    return
  }

  if (!shiftKey) {
    config.rangeSelection.start = rowElement
  } else {
    config.rangeSelection.end = rowElement
    config.eventHub.emit(EventType.ON_RANGE_SELECTION_CHANGE, {
      start: config.rangeSelection.start,
      end: config.rangeSelection.end,
    })
  }
}

/**
 * Perform the multi selection
 */
export function setMultiSelection(
  config: GridContext,
  rowElement: GridElement,
  forceKeepSelection = false
) {
  if (forceKeepSelection) {
    rowElement.addClasses(['selected'])
    if (!config.selectedRows?.has(rowElement)) {
      config.selectedRows?.add(rowElement)
    }

    return
  }

  rowElement.toggleClasses(['selected'])
  if (config.selectedRows?.has(rowElement)) {
    config.selectedRows?.delete(rowElement)
  } else {
    config.selectedRows?.add(rowElement)
  }
}

/**
 * Perform the single selection
 */
function setSingleSelection(config: GridContext, rowElement: GridElement) {
  config.selectedRows?.forEach((row) => row.removeClasses(['selected']))
  config.selectedRows?.clear()
  rowElement.addClasses(['selected'])
  config.selectedRows?.add(rowElement)
}

export function setupGridRangeSelection<T>(
  config: GridConfig<T> & GridContext,
  rowGridElements: GridElement[]
): Disposable {
  const listener = config.eventHub.on<RangeSelectionEvent>(
    EventType.ON_RANGE_SELECTION_CHANGE,
    (e) => {
      const { start, end } = e

      const startIndex = rowGridElements.indexOf(start)
      const endIndex = rowGridElements.indexOf(end)

      const startRow = Math.min(startIndex, endIndex)
      const endRow = Math.max(startIndex, endIndex)

      for (let i = startRow; i <= endRow; i++) {
        setMultiSelection(config, rowGridElements[i], true)
      }
    }
  )

  const clearAll = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      config.selectedRows?.forEach((row) => row.removeClasses(['selected']))
      config.selectedRows?.clear()
    }
  }

  document.addEventListener('keydown', clearAll)

  return {
    destroy() {
      listener.destroy()
      document.removeEventListener('keydown', clearAll)
    },
  }
}
