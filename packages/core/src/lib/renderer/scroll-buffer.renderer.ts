import { Disposable } from '../config'
import { Logger } from '../logger'
import { createElement, GridElement } from './element'
import { RowRenderer } from './row.renderer'

export function setScrollBuffer<T>(
  rowsElement: GridElement,
  rowHeight = 30,
  rows: RowRenderer<T>[],
  bufferSize: number,
  logger?: Logger
): Disposable {
  const postRowPadding = createElement('div', ['post-row-padding'])
  postRowPadding.setHeight(rows.length * (rowHeight ?? 30))
  rowsElement.appendChild(postRowPadding)

  let firstVisibleRowCache = 0
  let lastVisibleRowCache = bufferSize

  let rowsToRender = rows.slice(firstVisibleRowCache, lastVisibleRowCache)
  rowsToRender.forEach((row) => rowsElement.appendChild(row.element))

  rowsElement.appendChild(postRowPadding)

  const scrollListener = rowsElement.addEventListener('scroll', (e: Event) => {
    const scrollEvent = e as MouseEvent

    const scrollTop = scrollEvent.target
      ? (scrollEvent.target as HTMLElement).scrollTop
      : 0
    const scrollBottom =
      scrollTop +
      (scrollEvent.target
        ? (scrollEvent.target as HTMLElement).clientHeight
        : 0)

    const firstVisibleRow = Math.floor(scrollTop / (rowHeight ?? 30))
    const lastVisibleRow =
      Math.floor(scrollBottom / (rowHeight ?? 30)) + bufferSize

    if (
      firstVisibleRow === firstVisibleRowCache &&
      lastVisibleRow === lastVisibleRowCache
    ) {
      return
    }

    rowsToRender = rows.slice(firstVisibleRowCache, lastVisibleRowCache)
    rowsToRender.forEach((row) => {
      if (row.element.getIndex() === -1) {
        rowsElement.appendChild(row.element)
      }
    })

    rowsElement.appendChild(postRowPadding)

    postRowPadding.setHeight((rows.length - lastVisibleRow) * (rowHeight ?? 30))

    firstVisibleRowCache = firstVisibleRow
    lastVisibleRowCache = lastVisibleRow
  })

  logger?.log('Rendered ' + rowsToRender.length + ' rows')

  return {
    destroy() {
      scrollListener.destroy()
    },
  }
}
