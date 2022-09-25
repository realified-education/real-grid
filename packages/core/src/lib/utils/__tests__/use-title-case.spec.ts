import { useTitleCase } from '../use-title-case'

describe('useTitleCase', () => {
  it('should return a title case string', () => {
    expect(useTitleCase('hello world')).toEqual('Hello World')
  })
})
