/* eslint-disable @typescript-eslint/no-explicit-any */
export type Logger = {
  log: (message: string, ...args: any[]) => void
}

export function createLogger(isDebug?: boolean): Logger {
  if (!isDebug) {
    return createEmptyLogger()
  }

  return {
    log(message, args = '') {
      if (isDebug) {
        console.log(message, args)
      }
    },
  }
}

function createEmptyLogger(): Logger {
  return {
    log() {
      // do nothing
    },
  }
}
