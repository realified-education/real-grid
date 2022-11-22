import { GridConfig } from '../config'
import { GridOperator } from './types'

export function useCellSelection<T>(): GridOperator<T> {
  return (config: GridConfig<T>) => {
    return {
      ...config,
      enableCellSelection: true,
    }
  }
}
