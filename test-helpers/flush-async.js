const flushAsync = () => new Promise(process.nextTick)

export { flushAsync }
