export function info(message, noEllipsis) {
  console.log(`${message}${noEllipsis ? '' : '...'}`)
}

export const timer = {
  startTimer() {
    startTime = Date.now()
  },
  getTime() {
    return `Time taken: ${Date.now() - startTime}`
  }
}