import { fetchProxyRules } from '~/src/server/services/helpers/fetch/fetch-proxy-rules.js'
import { findAllProxyRules } from '~/src/server/services/service/proxy/helpers/find-proxy-rules.js'

jest.mock('~/src/server/services/helpers/fetch/fetch-proxy-rules')

describe('#findAllProxyRules', () => {
  test('Should return all proxy rules for a service in environments', async () => {
    fetchProxyRules
      .mockResolvedValueOnce({
        defaultDomains: ['.test.gov']
      })
      .mockResolvedValue({
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov']
      })

    const response = await findAllProxyRules('test-service', [
      'infra-dev',
      'prod'
    ])

    expect(response).toEqual([
      {
        environment: 'infra-dev',
        rules: {
          allowedDomains: [],
          defaultDomains: ['.test.gov'],
          isProxySetup: true
        }
      },
      {
        environment: 'prod',
        rules: {
          allowedDomains: ['.test.example.com'],
          defaultDomains: ['.test.gov'],
          isProxySetup: true
        }
      }
    ])
  })
})
