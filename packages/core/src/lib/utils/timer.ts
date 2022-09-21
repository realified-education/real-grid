/**
 * Create a timer
 */
export function createTimer() {
  let timer: number | undefined
  const start = new Date().getTime()

  return {
    stop: () => {
      timer = new Date().getTime() - start
    },
    get: () => {
      return timer
    },
  }
}
