import { GridConfig } from '../../config/config'
import { useData } from '../use-data'

describe('useData', () => {
  it('should return a data', () => {
    expect(
      useData([{ name: 'John' }])({} as GridConfig<{ name: string }>)
    ).toEqual({
      data: [{ name: 'John' }],
    })
  })
})
