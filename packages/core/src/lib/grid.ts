import { Disposable, GridConfig, GridRenderConfig } from './config'
import { GridContext } from './context'
import { createLogger } from './logger'
import { GridOperator } from './operators'
import { gridRenderer } from './renderer/grid.renderer'

export type RealGrid = (renderConfig: GridRenderConfig) => Disposable

export function createGrid<T>(...operators: GridOperator<T>[]): RealGrid {
  let config: GridConfig<T> & GridContext = {}

  return (renderConfig: GridRenderConfig) => {
    config = operators.reduce((currentConfig, operator) => {
      return operator(currentConfig)
    }, config)

    config.logger = createLogger(config.isDebug)
    config.columnContext = config.columns?.map(() => ({}))

    return gridRenderer(config, renderConfig)
  }
}
