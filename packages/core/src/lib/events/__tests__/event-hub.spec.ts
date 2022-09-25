import { EventType } from '../event-types'
import { createEventHub } from '../events-hub'

describe('createEventHub', () => {
  it('should create the event hub', () => {
    const eventHub = createEventHub()
    expect(eventHub).toBeDefined()
  })

  it('should listen and emit', () => {
    const eventHub = createEventHub()
    const callback = jest.fn()
    eventHub.on(EventType.ON_RANGE_SELECTION_CHANGE, callback)
    eventHub.emit(EventType.ON_RANGE_SELECTION_CHANGE, 'test')
    expect(callback).toBeCalledWith('test')
  })
})
