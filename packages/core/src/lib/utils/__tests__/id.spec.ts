import { generateId } from '../id'

describe('generateId', () => {
  it('should generate a random id', () => {
    const id = generateId()
    expect(id).toMatch(/^[0-9a-z]{7}$/)
  })
})
