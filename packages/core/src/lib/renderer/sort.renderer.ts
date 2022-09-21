import { Disposable, GridConfig, GridRenderConfig } from '../config/config'
import { GridContext, SortDirection } from '../context'
import { createTimer } from '../utils/timer'
import { ColumnRenderer } from './column.renderer'
import { RowRenderer } from './row.renderer'
import { DataKey } from './types'

export function createSort<T, K extends keyof T>(
  columns: ColumnRenderer<T, K>[],
  rows: RowRenderer<T>[],
  config: GridConfig<T> & GridContext,
  renderConfig: GridRenderConfig
): Disposable {
  const disposables: Disposable[] = []

  columns.forEach((column) => {
    setSortToContext(column, config)

    const disposable = column.on('sort', (event) => {
      const timer = createTimer()
      const sortDirection = getSortDirection(column, config)
      const type = column.config.type ?? undefined
      let sortedRows: RowRenderer<T>[] = []

      const sortFunction = column.config.sortFunction

      // Custom provided sort function
      if (sortFunction) {
        sortedRows = rows.sort((a, b) => {
          return sortFunction(
            {
              config: column.config,
              row: a.data,
              data: a.data[event.config.key],
            },
            {
              config: column.config,
              row: b.data,
              data: b.data[event.config.key],
            },
            sortDirection
          )
        })
      } else {
        sortedRows = rows.sort((a, b) => {
          const aVal = a.data[event.config.key]
          const bVal = b.data[event.config.key]
          const direction = sortDirection === SortDirection.Ascending ? -1 : 1

          // Guess type
          if (type === undefined) {
            if (typeof aVal === 'string' && direction === 1) {
              return aVal.localeCompare(bVal as string)
            }

            if (typeof bVal === 'string' && direction === -1) {
              return bVal.localeCompare(aVal as string)
            }

            if (typeof aVal === 'number') {
              return (aVal as number) * direction - (bVal as number) * direction
            }
          }

          if (aVal < bVal) {
            return direction
          }
          if (aVal > bVal) {
            return -direction
          }
          return 0
        })
      }

      sortedRows.forEach((row) => {
        config.rowsElement?.appendChild(row.element)
      })

      if (config.sortContext) {
        config.sortContext[event.config.key as string] = sortDirection
      }

      timer.stop()
      config.logger?.log('Sort completed in ' + timer.get() + 'ms')
    })

    disposables.push(disposable)
  })

  return {
    destroy: () => {
      disposables.forEach((d) => d.destroy())
    },
  }
}

/**
 * Set the sort to the context
 */
function setSortToContext<T, K extends DataKey<T>>(
  column: ColumnRenderer<T, K>,
  config: GridConfig<T> & GridContext
) {
  if (config.sortContext) {
    config.sortContext[column.config.key as string] =
      column.config.sortDirection ?? SortDirection.Default
  }
}

/**
 * Get the sort direction for the column
 */
function getSortDirection<T, K extends DataKey<T>>(
  column: ColumnRenderer<T, K>,
  config: GridConfig<T> & GridContext
): SortDirection {
  const direction = config.sortContext?.[column.config.key as string]
  if (direction === SortDirection.Ascending) {
    return SortDirection.Descending
  }

  return SortDirection.Ascending
}
