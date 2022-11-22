import { Disposable } from '../config'

type RealElement = HTMLElement & {
  real: {[key: string]: unknown}
}

export type GridElement = {
  appendChild: (child: GridElement) => void
  removeChild: (child: GridElement) => void
  detach: () => void
  setData: (name: string, data: unknown) => void
  getData<T>(name: string): T | undefined
  setAttribute: (name: string, value: string) => void
  removeAttribute: (name: string) => void
  addEventListener: (
    name: string,
    handler: (event: Event) => void
  ) => Disposable
  removeEventListener: (name: string, handler: (event: Event) => void) => void
  getElement: () => RealElement
  addClasses: (name: string[]) => void
  toggleClasses: (names: string[]) => void
  removeClasses: (name: string[]) => void
  destroy: () => void
  setText: (text: string) => void
  getText: () => string
  setWidth: (width: number) => void
  setHeight: (width: number) => void
  setStyle: (name: string, value: string) => void
  getIndex: () => number
}

export function createElement(
  tag: keyof HTMLElementTagNameMap | RealElement | HTMLElement | null = 'div',
  classes: string[] = []
): GridElement {
  let element: RealElement
  if (typeof tag === 'string') {
    element = document.createElement(tag) as RealElement
  } else if (tag instanceof HTMLElement) {
    element = tag as RealElement
  } else {
    element = document.createElement('div') as unknown as RealElement
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
    setData(name, data) {
      if (!element.real) {
        element.real = {}
      }

      element.real[name] = data
    },
    getData<T>(name: string) {
      return element.real?.[name] as T | undefined
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
      names.forEach((name) => {
        if (element.classList.contains('real-' + name)) {
          element.classList.remove('real-' + name)
        }
      })
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
    getIndex() {
      const parent = element.parentElement;
      if (!parent) return -1
      // The equivalent of parent.children.indexOf(child)
      return Array.prototype.indexOf.call(parent.children, element);
    }
  }

  results.addClasses(classes)

  return results
}
