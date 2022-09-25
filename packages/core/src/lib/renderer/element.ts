import { Disposable } from '../config'

export type GridElement = {
  appendChild: (child: GridElement) => void
  removeChild: (child: GridElement) => void
  detach: () => void
  setAttribute: (name: string, value: string) => void
  removeAttribute: (name: string) => void
  addEventListener: (
    name: string,
    handler: (event: Event) => void
  ) => Disposable
  removeEventListener: (name: string, handler: (event: Event) => void) => void
  getElement: () => HTMLElement
  addClasses: (name: string[]) => void
  toggleClasses: (names: string[]) => void
  removeClasses: (name: string[]) => void
  destroy: () => void
  setText: (text: string) => void
  getText: () => string
  setWidth: (width: number) => void
  setHeight: (width: number) => void
  setStyle: (name: string, value: string) => void
}

export function createElement(
  tag: keyof HTMLElementTagNameMap | HTMLElement | null = 'div',
  classes: string[] = []
): GridElement {
  let element: HTMLElement
  if (typeof tag === 'string') {
    element = document.createElement(tag)
  } else if (tag instanceof HTMLElement) {
    element = tag
  } else {
    element = document.createElement('div')
  }

  const results: GridElement = {
    appendChild(child) {
      element.appendChild(child.getElement())
    },
    removeChild(child) {
      element.removeChild(child.getElement())
    },
    detach() {
      element.remove()
    },
    setAttribute(name, value) {
      element.setAttribute(name, value)
    },
    removeAttribute(name) {
      element.removeAttribute(name)
    },
    addEventListener(name, handler) {
      element.addEventListener(name, handler)
      return {
        destroy() {
          element.removeEventListener(name, handler)
        },
      }
    },
    removeEventListener(name, handler) {
      element.removeEventListener(name, handler)
    },
    getElement() {
      return element
    },
    addClasses(names) {
      names.forEach((name) => element.classList.add('real-' + name))
    },
    toggleClasses(names) {
      names.forEach((name) => element.classList.toggle('real-' + name))
    },
    removeClasses(names) {
      names.forEach((name) => element.classList.remove('real-' + name))
    },
    destroy() {
      element.remove()
    },
    setText(text) {
      element.innerText = text
    },
    getText() {
      return element.innerText
    },
    setWidth(width) {
      element.style.width = width + 'px'
    },
    setHeight(height) {
      element.style.height = height + 'px'
    },
    setStyle(name, value) {
      element.style.setProperty(name, value)
    },
  }

  results.addClasses(classes)

  return results
}
