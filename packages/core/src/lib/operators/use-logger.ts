import { GridOperator } from './types'

export function useLogger<T>(): GridOperator<T> {
  return (config) => {
    config.isDebug = true
    return config
  }
}
