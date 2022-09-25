import { Columns } from '../config'
import { GridOperator } from './types'

export function useColumns<T>(columns: Columns<T>): GridOperator<T> {
  return (config) => {
    config.columns = columns
    return config
  }
}
