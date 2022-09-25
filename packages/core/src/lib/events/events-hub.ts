import { Disposable } from '../config'
import { EventType } from './event-types'

export type EventHub = Disposable & {
  on<T>(eventType: EventType, callback: (args: T) => void): Disposable
  emit<T>(eventType: EventType, args: T): void
}

type UnknownCallback = (args: unknown) => void

/**
 * Event hub implementation
 *
 * Usage:
 *  const eventHub = createEventHub()
 *  const disposable = eventHub.on(EventType.ON_CLICK, (args) => {})
 *  eventHub.emit(EventType.ON_CLICK, { x: 1, y: 2 })
 */
export function createEventHub(): EventHub {
  const listeners = new Map<string, Set<(args: unknown) => void>>()

  return {
    on(eventType, callback) {
      if (!listeners.has(eventType)) {
        listeners.set(eventType, new Set())
      }

      const set = listeners.get(eventType) as Set<UnknownCallback>
      set.add(callback as UnknownCallback)

      return {
        destroy() {
          set.delete(callback as UnknownCallback)
        },
      }
    },
    emit(eventType, args) {
      if (!listeners.has(eventType)) {
        return
      }

      const set = listeners.get(eventType) as Set<UnknownCallback>
      set.forEach((callback) => {
        callback(args)
      })
    },
    destroy() {
      listeners.clear()
    },
  }
}
