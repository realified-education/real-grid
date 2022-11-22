import { Disposable, GridConfig, GridRenderConfig } from './config/config'
import { GridContext } from './config/context'
import { createEventHub } from './events/events-hub'
import { createLogger } from './logger'
import { GridOperator } from './operators'
import { gridRenderer } from './renderer/grid.renderer'
import { createTimer } from './utils/timer'

export type RealGrid = (renderConfig: GridRenderConfig) => Disposable

export function createGrid<T>(...operators: GridOperator<T>[]): RealGrid {
  const timer = createTimer()
  let config: GridConfig<T> & GridContext = {
    sortContext: {},
    renderContext: {},
    bufferSize: 50,
    selectedRows: new Set(),
    rangeSelection: {},
    cellSelection: {},
    allRowRenders: [],
    eventHub: createEventHub(),
  }

  return (renderConfig: GridRenderConfig) => {
    config = operators.reduce((currentConfig, operator) => {
      return operator(currentConfig)
    }, config)

    config.logger = createLogger(config.isDebug)
    config.columnContext = config.columns?.map(() => ({}))
    renderConfig.rowHeight = renderConfig.rowHeight || 30

    const results = gridRenderer(config, renderConfig)

    timer.stop()
    config.logger?.log('Grid created in ' + timer.get() + 'ms')
    return results
  }
}
