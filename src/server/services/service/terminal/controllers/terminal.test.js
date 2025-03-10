import { getTerminalEnvs } from '~/src/server/services/service/terminal/controllers/terminal.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js', () => ({
  fetchTenantService: jest.fn()
}))

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
  test('Should show standard envs without prod if tenant exists in those environments', async () => {
    fetchTenantService.mockResolvedValue(tenantService)
    const envs = await getTerminalEnvs({ serviceName: 'foo' }, [
      'dev',
      'test',
      'perf-test',
      'prod'
    ])
    expect(envs).toStrictEqual(['dev', 'test', 'perf-test'])
  })

  test('should only show envs the service exists in', async () => {
    fetchTenantService.mockResolvedValue({
      dev: { serviceCode: 'RSI', zone: 'protected' }
    })
    const envs = await getTerminalEnvs({ serviceName: 'foo' }, [
      'dev',
      'test',
      'perf-test',
      'prod'
    ])
    expect(envs).toStrictEqual(['dev'])
  })

  test('Should show prod if they have the break-glass scope', async () => {
    fetchTenantService.mockResolvedValue(tenantService)
    const envs = await getTerminalEnvs({ serviceName: 'foo' }, [
      'dev',
      'test',
      'perf-test',
      'prod',
      scopes.breakGlass
    ])
    expect(envs).toStrictEqual(['dev', 'test', 'perf-test', 'prod'])
  })
})
