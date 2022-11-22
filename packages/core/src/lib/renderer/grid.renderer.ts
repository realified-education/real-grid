import { Disposable, GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../config/context'
import { EventType } from '../events/event-types'
import { ColumnRenderer, columnRenderer } from './column.renderer'
import { createElement } from './element'
import { renderKeybindings } from './keybindings.renderer'
import { setupGridRangeSelection } from './row-selection.renderer'
import { RowRenderer, rowRenderer } from './row.renderer'
import { setScrollBuffer } from './scroll-buffer.renderer'
import { createSort } from './sort.renderer'
import { Renderer } from './types'

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
  config.allRowRenders = rowRenderers

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

  const clearClassListener = config.eventHub?.on(EventType.CLEAR_CELL_CLASS, (classes: string[]) => {
    clearCellClass(rowRenderers, classes)
  })

  const keyBindings = renderKeybindings(gridElement, config)

  return {
    destroy: () => {
      columnsElement.destroy()
      rowsElement.destroy()
      sortDisposable.destroy()
      scrollDisposable.destroy()
      rangeSelectionDisposable.destroy()
      clearClassListener?.destroy()
      keyBindings.destroy()
    },
  }
}

function clearCellClass<T>(rowRenderers: RowRenderer<T>[], classes: string[]) {
  let cells: Renderer[] = []
  rowRenderers.forEach(row =>{
    cells = cells.concat(row.cells)
  })
  
  cells.forEach(cell => {
    cell.element.removeClasses(classes)
  })
}