import { GridOperator } from './types'

export function useBuffer<T>(bufferSize: number): GridOperator<T> {
  return (config) => {
    config.bufferSize = bufferSize
    return config
  }
}
