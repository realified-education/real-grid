import { isInViewport } from '../viewport'

describe('isInViewport', () => {
  it('should return true if element is in viewport', () => {
    const element = document.createElement('div')
    element.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
    })) as unknown as () => DOMRect

    window.innerHeight = 100
    window.innerWidth = 100
    expect(isInViewport(element)).toEqual(true)
  })
})
