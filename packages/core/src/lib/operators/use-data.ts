import { GridConfig } from '../config/config'
import { GridOperator } from './types'

export function useData<T>(data: T[]): GridOperator<T> {
  return (config: GridConfig<T>) => {
    return {
      ...config,
      data,
    }
  }
}
