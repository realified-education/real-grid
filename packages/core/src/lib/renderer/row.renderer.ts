import { Column } from '../config/column.config'
import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../config/context'
import { generateId } from '../utils/id'
import { cellRenderer } from './cell.renderer'
import { createElement, GridElement } from './element'
import { renderRowSelection } from './row-selection.renderer'
import { DataKey, IncludeData, IncludeId, Renderer } from './types'

export type RowRenderer<T> = Renderer & IncludeData<T> & IncludeId & {
  cells: Renderer[]
}

export function rowRenderer<T>(
  data: T,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): RowRenderer<T> {
  const rowElement = createElement('div', ['row'])
  const columns = config.columns || []

  setupStripedRows(rowElement, renderConfig.disableStriped)
  const cells = renderCells(columns, data, rowElement, config)

  rowElement.setData('cells', cells)
  cells.map(x => x.element.setData('row', rowElement))

  renderRowHeight(rowElement, renderConfig.rowHeight)
  const rowId = generateId()

  const rowSelectionListener = renderRowSelection(rowElement, config)

  return {
    destroy: () => {
      rowSelectionListener.destroy()
      rowElement.destroy()
    },
    element: rowElement,
    data,
    id: rowId,
    cells,
  }
}

/**
 * Render row height
 */
function renderRowHeight(rowElement: GridElement, rowHeight?: number) {
  if (rowHeight) {
    rowElement.setStyle('height', rowHeight + 'px')
  }
}

/**
 * Setup striped rows
 */
function setupStripedRows(rowElement: GridElement, disableStriped?: boolean) {
  if (!disableStriped) {
    rowElement.addClasses(['striped'])
  }
}

/**
 * Render each cell in the row
 */
function renderCells<T, K extends DataKey<T>>(
  columns: Column<T, K>[],
  data: T,
  rowElement: GridElement,
  config:  GridConfig<T> & GridContext
) {
  const cellRenderers: Renderer[] = []
  columns.forEach((item) => {
    const cell = cellRenderer(data[item.key], item, config)
    rowElement.appendChild(cell.element)
    cellRenderers.push(cell)
  })

  return cellRenderers
}
