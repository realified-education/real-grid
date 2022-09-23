import { Disposable } from "../config"
import { createElement, GridElement } from "./element"
import { RowRenderer } from "./row.renderer"

enum ScrollDirection {
  Up = 'up',
  Down = 'down',
}

export function setScrollBuffer<T>(rowsElement: GridElement, rowHeight = 30, rows: RowRenderer<T>[], bufferSize: number): Disposable {
  const postRowPadding = createElement('div', ['post-row-padding'])
  postRowPadding.setHeight(rows.length * (rowHeight ?? 30))
  rowsElement.appendChild(postRowPadding)

  let firstVisibleRowCache = 0
  let lastVisibleRowCache = bufferSize

  const renderedIndex = new Map<number, RowRenderer<T>>()

  rows.forEach((row, i) => {
    if (i >= firstVisibleRowCache && i <= lastVisibleRowCache) {
      rowsElement.appendChild(row.element)
      renderedIndex.set(i, row)
    } else {
      // row.element.detach()
    }
  })

  rowsElement.appendChild(postRowPadding)

  const scrollListener = rowsElement.addEventListener('scroll', (e: Event) => {
    const scrollEvent = e as MouseEvent

    const scrollTop = scrollEvent.target ? (scrollEvent.target as HTMLElement).scrollTop : 0
    const scrollBottom = scrollTop + (scrollEvent.target ? (scrollEvent.target as HTMLElement).clientHeight : 0)

    const firstVisibleRow = Math.floor(scrollTop / (rowHeight ?? 30))
    const lastVisibleRow = Math.floor(scrollBottom / (rowHeight ?? 30))

    if (firstVisibleRow === firstVisibleRowCache && lastVisibleRow === lastVisibleRowCache) {
      return
    }
    const scrollDirection = 
      firstVisibleRow > firstVisibleRowCache || 
      lastVisibleRow > lastVisibleRowCache ? ScrollDirection.Down : ScrollDirection.Up

      rows.forEach((row, i) => {
        if (i >= firstVisibleRow && i <= lastVisibleRow) {
          rowsElement.appendChild(row.element)
          renderedIndex.set(i, row)
        } else {
          // row.element.detach()
        }
      })
    
      rowsElement.appendChild(postRowPadding)

    postRowPadding.setHeight((rows.length - lastVisibleRow) * (rowHeight ?? 30))

    firstVisibleRowCache = firstVisibleRow
    lastVisibleRowCache = lastVisibleRow
  })

  return {
    destroy() {
      scrollListener.destroy()
    }
  }
}