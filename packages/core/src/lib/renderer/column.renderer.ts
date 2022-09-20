import { Column } from '../config'
import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext } from '../context'
import { useTitleCase } from '../utils/use-title-case'
import { createElement } from './element'
import { Eventable, RealEventListener, Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

export type ColumnEventTypes = 'sort'

export type ColumnRenderer<T, K extends keyof T> = Renderer &
  Eventable<ColumnEventTypes, ColumnRenderer<T, K>, Column<T, K>> & {
    config: Column<T, K>
  }

export function columnRenderer<T, K extends keyof T>(
  columnConfig: Column<T, K>,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): ColumnRenderer<T, K> {
  const columnElement = createElement('div')
  columnElement.addClasses(['column'])

  const listeners: Map<
    ColumnEventTypes,
    RealEventListener<ColumnRenderer<T, K>, Column<T, K>>[]
  > = new Map()

  let results: ColumnRenderer<T, K> = undefined as unknown as ColumnRenderer<
    T,
    K
  >

  columnElement.addEventListener('click', (e: Event) => {
    listeners.get('sort')?.forEach((listener) =>
      listener({
        event: e,
        api: results as ColumnRenderer<T, K>,
        config: columnConfig,
      })
    )
  })

  const label = columnConfig.label || useTitleCase(columnConfig.key as string)

  columnElement.setText(label)
  columnElement.setWidth(columnConfig.width || DEFAULT_COLUMN_WIDTH)

  results = {
    destroy: () => {
      columnElement.destroy()
      listeners.clear()
    },
    element: columnElement,
    on: (type, listener) => {
      const listenersForType = listeners.get(type) || []
      listenersForType.push(listener)
      listeners.set(type, listenersForType)
      return {
        destroy: () => {
          const listenersForType = listeners.get(type) || []
          listeners.set(
            type,
            listenersForType.filter((l) => l !== listener)
          )
        },
      }
    },
    config: columnConfig,
  }

  return results
}
