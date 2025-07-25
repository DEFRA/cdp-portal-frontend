// eslint-disable-next-line @typescript-eslint/unbound-method
const flushAsync = () => new Promise(process.nextTick)

export { flushAsync }
