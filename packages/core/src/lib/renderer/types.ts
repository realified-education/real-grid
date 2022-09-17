import { Disposable } from '../config'
import { GridElement } from './element'

export interface Renderer extends Disposable {
  element: GridElement
}
