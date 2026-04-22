import {
  transformProxyRules,
  transformProxyRulesToRows
} from './transform-proxy-rules.js'
import { defaultSquidDomains } from '#config/default-squid-domains.js'

describe('transformProxyRules', () => {
  test('Should return transformed proxy rules', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com', ...defaultSquidDomains]
    })

    expect(response).toEqual({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: defaultSquidDomains,
        isProxySetup: true
      }
    })
  })

  test('Should only include default domains if they are in the services config domains', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com', defaultSquidDomains[0]]
    })

    expect(response.rules.defaultDomains).toEqual([defaultSquidDomains[0]])
  })

  test('Should be isProxySetup if it has some domains', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com']
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should be isProxySetup if it has allowed domains', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com']
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should be isProxySetup if it has default domains', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com']
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should be isProxySetup if it empty domains', () => {
    const response = transformProxyRules('infra-dev', {
      domains: [],
      defaultDomains: defaultSquidDomains
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should not be isProxySetup if it no domains', () => {
    const response = transformProxyRules('infra-dev', {})
    expect(response.rules.isProxySetup).toBeFalsy()
  })

  test('Should not be isProxySetup if it no squid config', () => {
    const response = transformProxyRules('infra-dev', null)
    expect(response.rules.isProxySetup).toBeFalsy()
  })
})

describe('transformProxyRulesToRows', () => {
  const environments = ['dev', 'test']
  const entity = {
    environments: {
      dev: {
        squid: {
          domains: ['.browserstack.com', '.cdp-int.defra.cloud', '.example.com']
        }
      },
      test: {
        squid: {
          domains: ['.browserstack.com', '.example.com', '.test.com']
        }
      }
    }
  }

  test('Renders to rows', () => {
    expect(transformProxyRulesToRows(environments, entity)).toEqual({
      allowedRows: [
        {
          envs: [
            {
              domain: '.example.com',
              id: 'dev',
              isDefault: false
            },
            {
              domain: '.example.com',
              id: 'test',
              isDefault: false
            }
          ]
        },
        {
          envs: [
            {
              domain: '',
              id: 'dev',
              isDefault: false
            },
            {
              domain: '.test.com',
              id: 'test',
              isDefault: false
            }
          ]
        }
      ],
      defaultRows: [
        {
          envs: [
            {
              domain: '.browserstack.com',
              id: 'dev',
              isDefault: true
            },
            {
              domain: '.browserstack.com',
              id: 'test',
              isDefault: true
            }
          ]
        },
        {
          envs: [
            {
              domain: '.cdp-int.defra.cloud',
              id: 'dev',
              isDefault: true
            },
            {
              domain: '',
              id: 'test',
              isDefault: true
            }
          ]
        }
      ]
    })
  })
})
