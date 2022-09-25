import { GridConfig } from '../../config'
import { useBuffer } from '../use-buffer'

describe('useBuffer', () => {
  it('should return a buffer size', () => {
    expect(useBuffer(10)({} as GridConfig<unknown>)).toEqual({
      bufferSize: 10,
    })
  })
})
