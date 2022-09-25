import { GridConfig } from '../../config'
import { useRowSelection } from '../use-row-selection'

describe('useRowSelection', () => {
  it('should return a rowSelection', () => {
    expect(useRowSelection()({} as GridConfig<unknown>)).toEqual({
      rowSelection: true,
    })
  })
})
