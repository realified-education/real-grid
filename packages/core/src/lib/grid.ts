import { Disposable, GridConfig, GridRenderConfig } from './config/config'
import { GridContext } from './context'
import { createLogger } from './logger'
import { GridOperator } from './operators'
import { gridRenderer } from './renderer/grid.renderer'

export type RealGrid = (renderConfig: GridRenderConfig) => Disposable

export function createGrid<T>(...operators: GridOperator<T>[]): RealGrid {
  const start = new Date().getTime()
  let config: GridConfig<T> & GridContext = { sortContext: {} }

  return (renderConfig: GridRenderConfig) => {
    config = operators.reduce((currentConfig, operator) => {
      return operator(currentConfig)
    }, config)

    config.logger = createLogger(config.isDebug)
    config.columnContext = config.columns?.map(() => ({}))

    const results = gridRenderer(config, renderConfig)

    const stop = new Date().getTime()
    config.logger?.log('Grid created in ' + (stop - start) + 'ms')
    return results
  }
}
