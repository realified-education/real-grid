import { Disposable, EMPTY_DISPOSABLE, GridConfig } from "../config";
import { GridContext } from "../config/context";
import { EventType } from "../events/event-types";
import { GridElement } from "./element";
import { Renderer } from "./types";

export function renderCellSelection<T>(
  cellElement: GridElement,
  config: GridConfig<T> & GridContext
): Disposable {
  if (!config.enableCellSelection || !config.cellSelection) {
    return EMPTY_DISPOSABLE
  }

  const cellSelection = config.cellSelection

  const mouseDownListener = cellElement.addEventListener('mousedown', () => {
    cellSelection.start = cellElement
    cellSelection.mouseDown = true
    applyClassesToRange(config)
  })

  const mouseEnterListener = cellElement.addEventListener('mouseenter', (e) => {
    if (!cellSelection.mouseDown) {
      return
    }
    cellSelection.end = cellElement
    applyClassesToRange(config)
  })

  const mouseUpListener = cellElement.addEventListener('mouseup', () => {
    cellSelection.mouseDown = false
    cellSelection.end = cellElement
    applyClassesToRange(config)
    cellSelection.end = undefined
    cellSelection.start = undefined
  })

  return {
    destroy() {
      mouseDownListener.destroy()
      mouseEnterListener.destroy()
      mouseUpListener.destroy()
    },
  }
}

function applyClassesToRange<T>(config: GridConfig<T> & GridContext) {
  config.eventHub?.emit(EventType.CLEAR_CELL_CLASS, ['selected', 'selected-top', 'selected-bottom', 'selected-left', 'selected-right'])

  if (!config.cellSelection) {
    return
  }

  const start = config.cellSelection.start
  const end = config.cellSelection.end


  if (!start || !end) {
    return
  }

  if (start === end) {
    start.addClasses(['selected-top', 'selected-bottom', 'selected-left', 'selected-right'])
    config.cellSelection.selectedCells = [start]
  }

  const startRow = start.getData<GridElement>('row')
  const endRow = end.getData<GridElement>('row')

  if (!startRow || !endRow) {
    return
  }

  const startIndex = config.allRowRenders?.map(x => x.element).indexOf(startRow) ?? -1
  const endIndex = config.allRowRenders?.map(x => x.element).indexOf(endRow) ?? -1
  const startCellIndex = start.getData<GridElement>('row')?.getData<Renderer[]>('cells')?.map(x => x.element).indexOf(start) ?? -1
  const endCellIndex = end.getData<GridElement>('row')?.getData<Renderer[]>('cells')?.map(x => x.element).indexOf(end) ?? -1

  if (startIndex === -1 || endIndex === -1) {
    return
  }

  // Get rows between startIndex and endIndex
  const rows = config.allRowRenders?.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  ) ?? []

  // add selected class to all cells between startCellIndex and endCellIndex for each of the rows
  config.cellSelection.selectedCells = []
  rows.forEach((row, rowIdx) => {
    const cells = row.element.getData<Renderer[]>('cells')
    const min = Math.min(startCellIndex, endCellIndex)
    const max = Math.max(startCellIndex, endCellIndex)
    cells?.slice(min, max + 1).forEach((cell, cellIdx) => {
      const classes = ['selected']
      cell.element.addClasses(classes)
      config.cellSelection?.selectedCells?.push(cell.element)
    })
  })
}