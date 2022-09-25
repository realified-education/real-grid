import { GridConfig } from '../config/config'
import { GridContext } from '../config/context'

export type GridOperator<T> = (
  config: GridConfig<T> & GridContext
) => GridConfig<T> & GridContext
