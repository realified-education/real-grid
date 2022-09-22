import { Column } from '../config/column.config'
import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../context'
import { generateId } from '../utils/id'
import { cellRenderer } from './cell.renderer'
import { createElement, GridElement } from './element'
import { renderRowSelection } from './row-selection.renderer'
import { DataKey, IncludeData, IncludeId, Renderer } from './types'

export type RowRenderer<T> = Renderer & IncludeData<T> & IncludeId

export function rowRenderer<T>(
  data: T,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): RowRenderer<T> {
  const rowElement = createElement('div', ['row'])
  const columns = config.columns || []

  setupStripedRows(rowElement, renderConfig.disableStriped)
  renderCells(columns, data, rowElement)
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
  rowElement: GridElement
) {
  columns.forEach((item) => {
    const cell = cellRenderer(data[item.key], item)
    rowElement.appendChild(cell.element)
  })
}
