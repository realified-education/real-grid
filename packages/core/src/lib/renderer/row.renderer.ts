import { Column } from '../config/column.config'
import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../context'
import { cellRenderer } from './cell.renderer'
import { createElement, GridElement } from './element'
import { DataKey, IncludeData, Renderer } from './types'

export type RowRenderer<T> = Renderer & IncludeData<T>

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

  return {
    destroy: () => {
      rowElement.destroy()
    },
    element: rowElement,
    data,
  }
}

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
