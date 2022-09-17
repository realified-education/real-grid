export type GridElement = {
  appendChild: (child: GridElement) => void
  removeChild: (child: GridElement) => void
  setAttribute: (name: string, value: string) => void
  removeAttribute: (name: string) => void
  addEventListener: (name: string, handler: (event: Event) => void) => void
  removeEventListener: (name: string, handler: (event: Event) => void) => void
  getElement: () => HTMLElement
  addClasses: (name: string[]) => void
  removeClasses: (name: string[]) => void
  destroy: () => void
  setText: (text: string) => void
  setWidth: (width: number) => void
}

export function createElement(
  tag: keyof HTMLElementTagNameMap | HTMLElement | null = 'div'
): GridElement {
  let element: HTMLElement
  if (typeof tag === 'string') {
    element = document.createElement(tag)
  } else if (tag instanceof HTMLElement) {
    element = tag
  } else if (tag === null) {
    element = document.createElement('div')
  }

  return {
    appendChild(child) {
      element.appendChild(child.getElement())
    },
    removeChild(child) {
      element.removeChild(child.getElement())
    },
    setAttribute(name, value) {
      element.setAttribute(name, value)
    },
    removeAttribute(name) {
      element.removeAttribute(name)
    },
    addEventListener(name, handler) {
      element.addEventListener(name, handler)
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
    removeClasses(names) {
      names.forEach((name) => element.classList.remove('real-' + name))
    },
    destroy() {
      element.remove()
    },
    setText(text) {
      element.innerText = text
    },
    setWidth(width) {
      element.style.width = width + 'px'
    },
  }
}
