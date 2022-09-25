import { GridConfig } from '../../config'
import { useLogger } from '../use-logger'

describe('useLogger', () => {
  it('should return a logger', () => {
    expect(useLogger()({} as GridConfig<unknown>)).toEqual({
      isDebug: true,
    })
  })
})
