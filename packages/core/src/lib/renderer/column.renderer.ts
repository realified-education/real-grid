import { Column, Disposable } from '../config'
import { GridConfig, GridRenderConfig } from '../config/config'
import { GridContext, SortContext, SortDirection } from '../context'
import { useTitleCase } from '../utils/use-title-case'
import { createElement, GridElement } from './element'
import { DataKey, Eventable, RealEventListener, Renderer } from './types'

const DEFAULT_COLUMN_WIDTH = 100

export type ColumnEventTypes = 'sort'

type EventListenerMap<T, K extends DataKey<T>> = Map<
  ColumnEventTypes,
  RealEventListener<ColumnRenderer<T, K>, Column<T, K>>[]
>

export type ColumnRenderer<T, K extends DataKey<T>> = Renderer &
  Eventable<ColumnEventTypes, ColumnRenderer<T, K>, Column<T, K>> & {
    config: Column<T, K>
  }

export function columnRenderer<T, K extends DataKey<T>>(
  columnConfig: Column<T, K>,
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): ColumnRenderer<T, K> {
  const columnElement = createElement('div', ['column'])
  const listeners = createListernerMap<T, K>()
  let results = getDefaultColumnRenderer<T, K>()

  setColumnLabel(columnElement, columnConfig)
  setWidth(columnElement, columnConfig.width)
  setSortIcon(columnElement, columnConfig, config.sortContext ?? {}, listeners)

  results = {
    destroy: () => {
      columnElement.destroy()
      clickListener.destroy()
      listeners.clear()
    },
    element: columnElement,
    on: (type, listener) => setOnListener(listeners, type, listener),
    config: columnConfig,
  }

  const clickListener = setColumnSortClickHandler(
    columnElement,
    listeners,
    results,
    columnConfig
  )

  return results
}

function setSortIcon<T, K extends DataKey<T>>(
  columnElement: GridElement,
  columnConfig: Column<T, K>,
  sortContext: SortContext,
  listeners: EventListenerMap<T, K>
): Disposable {
  const sortDirection =
    sortContext[columnConfig.key as string] ?? SortDirection.Ascending

  const sortIcon = createElement('span', ['sort-icon', sortDirection])
  columnElement.appendChild(sortIcon)

  const listener = setOnListener(listeners, 'sort', () => {
    if (sortIcon.getText() !== '^') {
      sortIcon.setText('^')
    }

    sortIcon.removeClasses(['asc', 'desc', 'default'])
    sortIcon.addClasses([sortContext[columnConfig.key as string]])
  })

  return {
    destroy: () => {
      sortIcon.destroy()
      listener.destroy()
    },
  }
}

/**
 * Set the on listener for the column
 */
function setOnListener<T, K extends DataKey<T>>(
  listeners: EventListenerMap<T, K>,
  type: ColumnEventTypes,
  listener: RealEventListener<ColumnRenderer<T, K>, Column<T, K>>
): Disposable {
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
}

/**
 * Sets the click handler for the column
 */
function setColumnSortClickHandler<T, K extends DataKey<T>>(
  columnElement: GridElement,
  listeners: EventListenerMap<T, K>,
  results: ColumnRenderer<T, K>,
  columnConfig: Column<T, K>
): Disposable {
  return columnElement.addEventListener('click', (e: Event) => {
    listeners.get('sort')?.forEach((listener) =>
      listener({
        event: e,
        api: results,
        config: columnConfig,
      })
    )
  })
}

/**
 * Get the default column renderer.
 *
 * Essentially hide the ugly types
 */
function getDefaultColumnRenderer<T, K extends DataKey<T>>() {
  return undefined as unknown as ColumnRenderer<T, K>
}

/**
 * A place to hide the ugly types
 */
function createListernerMap<T, K extends DataKey<T>>() {
  const listeners: EventListenerMap<T, K> = new Map()
  return listeners
}

/**
 * Sets the label for the column
 */
function setColumnLabel<T, K extends DataKey<T>>(
  columnElement: GridElement,
  columnConfig: Column<T, K>
) {
  const label = columnConfig.label || useTitleCase(columnConfig.key as string)
  columnElement.setText(label)
}

/**
 * Sets the width of the column
 *
 * This will later be used for auto width calculation
 */
function setWidth(columnElement: GridElement, width: number | undefined) {
  columnElement.setWidth(width || DEFAULT_COLUMN_WIDTH)
}
