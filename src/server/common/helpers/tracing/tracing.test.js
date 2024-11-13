import { config } from '~/src/config/index.js'
import {
  getTraceId,
  withTracing
} from '~/src/server/common/helpers/tracing/tracing.js'

describe('#tracing', () => {
  const route = {
    handler: (req, h) => {
      return { req, h, traceId: getTraceId() }
    }
  }

  const req = {
    headers: {
      'x-cdp-request-id': '12345'
    }
  }

  it('apply tracing to a single route', async () => {
    config.set('tracing.enabled', true)
    const routeWithTracing = withTracing(route)
    const resp = await routeWithTracing.handler(req, {})
    expect(resp?.traceId).toBe('12345')
  })

  it('apply tracing to an array of routes', async () => {
    config.set('tracing.enabled', true)
    const routeWithTracing = withTracing([route, route])

    const resp1 = await routeWithTracing[0].handler(req, {})
    expect(resp1?.traceId).toBe('12345')

    const resp2 = await routeWithTracing[1].handler(req, {})
    expect(resp2?.traceId).toBe('12345')
  })

  it('not apply tracing to an array of routes when disabled', async () => {
    config.set('tracing.enabled', false)
    const routeWithTracing = withTracing(route)
    const resp = await routeWithTracing.handler(req, {})
    expect(resp?.traceId).toBeUndefined()
  })

  it('work when header is not present', async () => {
    config.set('tracing.enabled', true)
    const routeWithTracing = withTracing(route)
    const resp = await routeWithTracing.handler({}, {})
    expect(resp?.traceId).toBeUndefined()
  })

  it('work when header is present but blank', async () => {
    config.set('tracing.enabled', true)
    const routeWithTracing = withTracing(route)
    const resp = await routeWithTracing.handler(
      { headers: { 'x-cdp-request-id': '' } },
      {}
    )
    expect(resp?.traceId).toBeUndefined()
  })
})
