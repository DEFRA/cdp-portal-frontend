import { defaultSquidDomains } from '../../../../../../../config/default-squid-domains.js'

/**
 *
 * @param {string} environment
 * @param {{ ports: number[], domains: string[] }} squidConfig
 * @returns {{environment: string, rules: {allowedDomains: *, defaultDomains: string[], isProxySetup: boolean}}}
 */
export function transformProxyRules(environment, squidConfig) {
  const defaultDomains = []
  const allowedDomains = []

  const isProxySetup = squidConfig?.domains != null

  if (isProxySetup) {
    squidConfig?.domains.forEach((domain) => {
      if (defaultSquidDomains.includes(domain)) {
        defaultDomains.push(domain)
      } else {
        allowedDomains.push(domain)
      }
    })

    defaultDomains.sort()
    allowedDomains.sort()
  }

  return {
    environment,
    rules: {
      allowedDomains,
      defaultDomains: isProxySetup ? defaultDomains : [],
      isProxySetup
    }
  }
}
