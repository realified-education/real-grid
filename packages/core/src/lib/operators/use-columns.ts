import { Column } from '../config'
import { GridOperator } from './types'

export function useColumns<T>(columns: Column[]): GridOperator<T> {
  return (config) => {
    config.columns = columns
    return config
  }
}
