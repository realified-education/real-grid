import { GridConfig } from '../../config'
import { useCellSelection } from '../use-cell-selection'

describe('useCellSelection', () => {
  it('should return a cellSelection', () => {
    expect(useCellSelection()({} as GridConfig<unknown>)).toEqual({
      cellSelection: true,
    })
  })
})
