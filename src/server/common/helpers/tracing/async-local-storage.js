import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()
const getTraceId = () => asyncLocalStorage.getStore()?.get('traceId')

export { asyncLocalStorage, getTraceId }
