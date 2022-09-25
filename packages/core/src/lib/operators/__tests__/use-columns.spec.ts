import { GridConfig } from '../../config'
import { useColumns } from '../use-columns'

describe('useColumns', () => {
  it('should return a columns', () => {
    expect(
      useColumns([{ key: 'name', label: 'Name' }])(
        {} as GridConfig<{ name: string }>
      )
    ).toEqual({
      columns: [{ key: 'name', label: 'Name' }],
    })
  })
})
