import { Disposable, GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../config/context'
import { ColumnRenderer, columnRenderer } from './column.renderer'
import { createElement } from './element'
import { setupGridRangeSelection } from './row-selection.renderer'
import { RowRenderer, rowRenderer } from './row.renderer'
import { setScrollBuffer } from './scroll-buffer.renderer'
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
  })

  const scrollDisposable = setScrollBuffer(
    rowsElement,
    renderConfig.rowHeight,
    rowRenderers,
    config.bufferSize,
    config.logger
  )

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

  gridElement.appendChild(columnsElement)
  gridElement.appendChild(rowsElement)

  return {
    destroy: () => {
      gridElement.destroy()
      columnsElement.destroy()
      rowsElement.destroy()
      sortDisposable.destroy()
      scrollDisposable.destroy()
      rangeSelectionDisposable.destroy()
    },
  }
}
