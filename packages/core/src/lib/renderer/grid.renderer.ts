import { Disposable, GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../context'
import { ColumnRenderer, columnRenderer } from './column.renderer'
import { createElement } from './element'
import { setupGridRangeSelection } from './row-selection.renderer'
import { RowRenderer, rowRenderer } from './row.renderer'
import { createSort } from './sort.renderer'

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

  config.rowsElement = rowsElement

  const columns = config.columns || []
  const rows = config.data || []
  const columnRenderers: ColumnRenderer<T, keyof T>[] = []
  const rowRenderers: RowRenderer<T>[] = []

  columns.forEach((item) => {
    const column = columnRenderer(item, config, renderConfig)
    columnRenderers.push(column)
    columnsElement.appendChild(column.element)
  })

  config.logger?.log(
    'Rendered columns ',
    columns.map((x) => x.key)
  )

  rows.forEach((item, i) => {
    const row = rowRenderer(item, config, renderConfig)
    rowRenderers.push(row)

    rowsElement.appendChild(row.element)
  })

  const rangeSelectionDisposable = setupGridRangeSelection(
    config,
    rowRenderers.map((x) => x.element)
  )

  const sortDisposable = createSort(
    columnRenderers,
    rowRenderers,
    config,
    renderConfig
  )

  config.logger?.log('Rendered ' + rows.length + ' rows')

  gridElement.appendChild(columnsElement)
  gridElement.appendChild(rowsElement)

  return {
    destroy: () => {
      gridElement.destroy()
      columnsElement.destroy()
      rowsElement.destroy()
      sortDisposable.destroy()
      rangeSelectionDisposable.destroy()
    },
  }
}
