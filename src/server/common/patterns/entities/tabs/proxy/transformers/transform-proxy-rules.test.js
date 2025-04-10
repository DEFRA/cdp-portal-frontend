import { transformProxyRules } from '~/src/server/common/patterns/entities/tabs/proxy/transformers/transform-proxy-rules.js'

describe('#transformProxyRules', () => {
  test('Should return transformed proxy rules', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov']
      }
    })

    expect(response).toEqual({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov'],
        isProxySetup: true
      }
    })
  })

  test('Should be isProxySetup if it has some domains', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov']
      }
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should be isProxySetup if it has allowed domains', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov']
      }
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should be isProxySetup if it has default domains', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {
        allowedDomains: ['.test.example.com'],
        defaultDomains: ['.test.gov']
      }
    })

    expect(response.rules.isProxySetup).toBeTruthy()
  })

  test('Should not be isProxySetup if it empty domains', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {
        allowedDomains: [],
        defaultDomains: []
      }
    })

    expect(response.rules.isProxySetup).toBeFalsy()
  })

  test('Should not be isProxySetup if it no domains', () => {
    const response = transformProxyRules({
      environment: 'infra-dev',
      rules: {}
    })

    expect(response.rules.isProxySetup).toBeFalsy()
  })
})
