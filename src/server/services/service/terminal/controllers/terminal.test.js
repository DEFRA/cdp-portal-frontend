import nock from 'nock'

import { getTerminalEnvs } from './terminal.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { config } from '../../../../../config/config.js'

const mockService = 'mock-service'
const tenantServicesEndpointUrl = new URL(
  config.get('portalBackendUrl') + `/tenant-services/${mockService}`
)
const notFound = {
  output: { statusCode: 404 },
  message: 'Not Found'
}
const tenantService = {
  'perf-test': { serviceCode: 'RSI', zone: 'protected' },
  'ext-test': { serviceCode: 'RSI', zone: 'protected' },
  'infra-dev': { serviceCode: 'RSI', zone: 'protected' },
  test: { serviceCode: 'RSI', zone: 'protected' },
  dev: { serviceCode: 'RSI', zone: 'protected' },
  prod: { serviceCode: 'RSI', zone: 'protected' },
  management: { serviceCode: 'RSI', zone: 'protected' }
}

describe('#getTerminalEnvs', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  test('Should show standard envs without prod if tenant exists in those environments', async () => {
    nock(tenantServicesEndpointUrl.origin)
      .get(tenantServicesEndpointUrl.pathname)
      .reply(200, tenantService)

    const result = await getTerminalEnvs(mockService, [
      'dev',
      'test',
      'perf-test',
      'prod'
    ])

    expect(result).toStrictEqual(['dev', 'test', 'perf-test'])
  })

  test('Should only show envs the service exists in', async () => {
    nock(tenantServicesEndpointUrl.origin)
      .get(tenantServicesEndpointUrl.pathname)
      .reply(200, {
        dev: { serviceCode: 'RSI', zone: 'protected' }
      })

    const result = await getTerminalEnvs(mockService, [
      'dev',
      'test',
      'perf-test',
      'prod'
    ])

    expect(result).toStrictEqual(['dev'])
  })

  test('Should show prod if they have the break-glass scope', async () => {
    nock(tenantServicesEndpointUrl.origin)
      .get(tenantServicesEndpointUrl.pathname)
      .reply(200, tenantService)

    const result = await getTerminalEnvs(mockService, [
      'dev',
      'test',
      'perf-test',
      'prod',
      scopes.breakGlass
    ])

    expect(result).toStrictEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should provide empty array when details not found', async () => {
    nock(tenantServicesEndpointUrl.origin)
      .get(tenantServicesEndpointUrl.pathname)
      .reply(404, notFound)

    const result = await getTerminalEnvs(mockService, [])

    expect(result).toEqual([])
  })

  test('Should provide empty array when serviceName not provided', async () => {
    nock(tenantServicesEndpointUrl.origin)
      .get(tenantServicesEndpointUrl.pathname)
      .reply(404, notFound)

    const result = await getTerminalEnvs()

    expect(result).toEqual([])
  })
})
