import { GridConfig } from '../config'
import { GridContext } from '../context'

export type GridOperator<T> = (
  config: GridConfig<T> & GridContext
) => GridConfig<T> & GridContext
