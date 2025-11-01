import { transformProxyRules } from './transform-proxy-rules.js'
import { defaultSquidDomains } from '../../../../../../../config/default-squid-domains.js'

describe('#transformProxyRules', () => {
  test('Should return transformed proxy rules', () => {
    const response = transformProxyRules('infra-dev', {
      domains: ['.test.example.com']
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
