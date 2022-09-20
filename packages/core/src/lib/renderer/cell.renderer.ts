import { Column } from '../config'
import { createElement } from './element'
import { Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

export function cellRenderer<T, K extends keyof T>(
  data: T[K],
  columnConfig: Column<T, K>
): Renderer {
  const cellElement = createElement('div')
  cellElement.addClasses(['cell'])

  let cellData = data + ''

  if (columnConfig.valueGetter) {
    cellData = columnConfig.valueGetter(data)
  }

  cellElement.setText(cellData)
  cellElement.setWidth(columnConfig.width || DEFAULT_COLUMN_WIDTH)

  return {
    destroy: () => {
      cellElement.destroy()
    },
    element: cellElement,
  }
}
