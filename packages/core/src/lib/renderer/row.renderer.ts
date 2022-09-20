import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../context'
import { cellRenderer } from './cell.renderer'
import { createElement } from './element'
import { IncludeData, Renderer } from './types'

export type RowRenderer<T> = Renderer & IncludeData<T>

export function rowRenderer<T>(
  data: T,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): RowRenderer<T> {
  const rowElement = createElement('div')
  rowElement.addClasses(['row'])

  const columns = config.columns || []

  const dataMap = data as Record<keyof T, unknown>

  columns.forEach((item) => {
    const cell = cellRenderer(dataMap[item.key], item)
    rowElement.appendChild(cell.element)
  })

  return {
    destroy: () => {
      rowElement.destroy()
    },
    element: rowElement,
    data,
  }
}
