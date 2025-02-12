/**
 * @param {{environment: string, rules: object}} options
 * @returns {{environment: string, rules: {allowedDomains: string[], defaultDomains: string[], isProxySetup: boolean}}}
 */
export function transformProxyRules({ environment, rules = {} }) {
  const allowedDomains = rules?.allowedDomains ?? []
  const defaultDomains = rules?.defaultDomains ?? []
  const isProxySetup = allowedDomains.length + defaultDomains.length > 0
  return {
    environment,
    rules: {
      allowedDomains,
      defaultDomains,
      isProxySetup
    }
  }
}
