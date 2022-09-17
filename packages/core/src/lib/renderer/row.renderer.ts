import { GridConfig, GridRenderConfig } from '../config'
import { GridContext } from '../context'
import { cellRenderer } from './cell.renderer'
import { createElement } from './element'
import { Renderer } from './types'

export function rowRenderer<T>(
  data: T,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): Renderer {
  const rowElement = createElement('div')
  rowElement.addClasses(['row'])

  const columns = config.columns || []

  const dataMap = data as Record<keyof T, unknown>

  columns.forEach((item) => {
    const cell = cellRenderer(dataMap[item.key as keyof T], item)
    rowElement.appendChild(cell.element)
  })

  return {
    destroy: () => {
      rowElement.destroy()
    },
    element: rowElement,
  }
}
