import { Column } from '../config'
import { createElement } from './element'
import { Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

export function cellRenderer(data: unknown, columnConfig: Column): Renderer {
  const cellElement = createElement('div')
  cellElement.addClasses(['cell'])

  cellElement.setText(data + '')
  cellElement.setWidth(columnConfig.width || DEFAULT_COLUMN_WIDTH)

  return {
    destroy: () => {
      cellElement.destroy()
    },
    element: cellElement,
  }
}
