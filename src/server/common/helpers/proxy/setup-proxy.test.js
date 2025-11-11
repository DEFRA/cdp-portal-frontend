import { config } from '../../../../config/config.js'
import { setupProxy } from './setup-proxy.js'
import { getGlobalDispatcher, ProxyAgent } from 'undici'
import http from 'http'
import https from 'https'

describe('setupProxy', () => {
  afterEach(() => {
    config.set('httpProxy', null)
  })

  test('Should not setup proxy if the environment variable is not set', () => {
    config.set('httpProxy', null)
    setupProxy()

    expect(global?.GLOBAL_AGENT?.HTTP_PROXY).toBeUndefined()

    const undiciDispatcher = getGlobalDispatcher()
    expect(undiciDispatcher).not.toBeInstanceOf(ProxyAgent)
  })

  test('Should setup proxy if the environment variable is set', async () => {
    // this is set in the environments
    process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://localhost:8080'
    config.set('httpProxy', 'http://localhost:8080')
    setupProxy()

    expect(http.globalAgent.constructor.name).toBe('BoundHttpProxyAgent')
    expect(https.globalAgent.constructor.name).toBe('BoundHttpsProxyAgent')

    expect(http.globalAgent.isProxyConfigured()).toBe('http://localhost:8080')
    expect(https.globalAgent.isProxyConfigured()).toBe('http://localhost:8080')

    const undiciDispatcher = getGlobalDispatcher()
    expect(undiciDispatcher).toBeInstanceOf(ProxyAgent)
  })

  test('explicitly set proxy takes precedence over environment variables', async () => {
    // this is set in the environments
    process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://localhost:8080'
    config.set('httpProxy', 'http://localhost:8080')
    setupProxy()

    global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:8081'

    expect(http.globalAgent.constructor.name).toBe('BoundHttpProxyAgent')
    expect(https.globalAgent.constructor.name).toBe('BoundHttpsProxyAgent')

    expect(http.globalAgent.isProxyConfigured()).toBe('http://localhost:8081')
    expect(https.globalAgent.isProxyConfigured()).toBe('http://localhost:8081')

    const undiciDispatcher = getGlobalDispatcher()
    expect(undiciDispatcher).toBeInstanceOf(ProxyAgent)
  })
})
