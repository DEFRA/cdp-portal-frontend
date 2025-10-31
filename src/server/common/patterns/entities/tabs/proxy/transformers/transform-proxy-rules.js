import { defaultSquidDomains } from '../../../../../../../config/default-squid-domains.js'

/**
 *
 * @param {string} environment
 * @param {{ ports: number[], domains: string[] }} squidConfig
 * @returns {{environment: string, rules: {allowedDomains: *, defaultDomains: string[], isProxySetup: boolean}}}
 */
export function transformProxyRules(environment, squidConfig) {
  const defaultDomains = defaultSquidDomains
  const allowedDomains = (
    squidConfig?.domains?.filter((d) => !defaultDomains.includes(d)) ?? []
  ).sort()
  const isProxySetup = squidConfig?.domains != null
  return {
    environment,
    rules: {
      allowedDomains,
      defaultDomains: isProxySetup ? defaultDomains : [],
      isProxySetup
    }
  }
}
