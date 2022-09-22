import { GridConfig } from '../config'
import { GridOperator } from './types'

export function useRowSelection<T>(isMulti?: boolean): GridOperator<T> {
  return (config: GridConfig<T>) => {
    return {
      ...config,
      rowSelection: true,
      multiRowSelection: isMulti,
    }
  }
}
