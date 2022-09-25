import { createTimer } from '../timer'

describe('createTimer', () => {
  it('should create a timer', () => {
    const timer = createTimer()
    expect(timer).toBeDefined()
  })

  it('should stop the timer', () => {
    const timer = createTimer()
    timer.stop()
    expect(timer.get()).toBeDefined()
  })
})
