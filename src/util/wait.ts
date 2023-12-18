export function wait(ms: number = 500) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}
