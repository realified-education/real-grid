import { Disposable, GridConfig, GridRenderConfig } from '../config'
import { GridContext } from '../context'
import { columnRenderer } from './column.renderer'
import { createElement } from './element'
import { rowRenderer } from './row.renderer'

export function gridRenderer<T>(
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): Disposable {
  const gridElement = createElement(renderConfig.container)
  const columnsElement = createElement('div')
  const rowsElement = createElement('div')
  gridElement.addClasses(['grid'])
  columnsElement.addClasses(['columns'])
  rowsElement.addClasses(['rows'])

  const columns = config.columns || []
  const rows = config.data || []

  columns.forEach((item) => {
    const column = columnRenderer(item, config, renderConfig)
    columnsElement.appendChild(column.element)
  })

  config.logger?.log(
    'Rendered columns ',
    columns.map((x) => x.key)
  )

  rows.forEach((item) => {
    const row = rowRenderer(item, config, renderConfig)
    rowsElement.appendChild(row.element)
  })

  config.logger?.log('Rendered ' + rows.length + ' rows')

  gridElement.appendChild(columnsElement)
  gridElement.appendChild(rowsElement)

  return {
    destroy: () => {
      gridElement.destroy()
    },
  }
}
