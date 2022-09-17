import { Column, GridConfig, GridRenderConfig } from '../config'
import { GridContext } from '../context'
import { useTitleCase } from '../utils/use-title-case'
import { createElement } from './element'
import { Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

export function columnRenderer<T>(
  columnConfig: Column,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): Renderer {
  const columnElement = createElement('div')
  columnElement.addClasses(['column'])

  const label = columnConfig.label || useTitleCase(columnConfig.key)

  columnElement.setText(label)
  columnElement.setWidth(columnConfig.width || DEFAULT_COLUMN_WIDTH)

  return {
    destroy: () => {
      columnElement.destroy()
    },
    element: columnElement,
  }
}
