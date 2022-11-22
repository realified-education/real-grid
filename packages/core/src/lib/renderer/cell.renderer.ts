import { Column, GridConfig, ValueGetterFunction } from '../config'
import { GridContext } from '../config/context'
import { renderCellSelection } from './cell-selection.renderer'
import { createElement, GridElement } from './element'
import { DataKey, Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

/**
 * Render the row cell
 */
export function cellRenderer<T, K extends DataKey<T>>(
  data: T[K],
  columnConfig: Column<T, K>,
  config:  GridConfig<T> & GridContext
): Renderer {
  const cellElement = createElement('div', ['cell'])

  renderCellContents(data, cellElement, columnConfig.valueGetter)
  setWidth(cellElement, columnConfig.width)

  const cellSelectionListener = renderCellSelection(cellElement, config)

  return {
    destroy: () => {
      cellElement.destroy()
      cellSelectionListener.destroy()
    },
    element: cellElement,
  }
}

/**
 * Render cell contents
 *
 * Renders using the value getter function if provided
 */
function renderCellContents<T, K extends DataKey<T>>(
  data: T[K],
  cellElement: GridElement,
  valueGetter?: ValueGetterFunction<T, K>
) {
  const cellData = valueGetter?.(data) ?? data + ''
  cellElement.setText(cellData)
}

/**
 * Render width of the cell
 *
 * This will later be used for auto width calculation
 */
function setWidth(cellElement: GridElement, width: number | undefined) {
  cellElement.setWidth(width || DEFAULT_COLUMN_WIDTH)
}
