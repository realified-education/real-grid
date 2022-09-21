import { Disposable } from '../config/config'
import { GridElement } from './element'

export interface RealEvent<T, K> {
  api: T
  event: Event
  config: K
}
export type RealEventListener<T, K> = (event: RealEvent<T, K>) => void

export interface Eventable<T extends string, K, J> {
  on(type: T, listener: RealEventListener<K, J>): Disposable
}

export interface Renderer extends Disposable {
  element: GridElement
}

export interface IncludeData<T> {
  data: T
}

export type DataKey<T> = keyof T
