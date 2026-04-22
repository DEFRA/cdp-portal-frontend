import { defaultSquidDomains } from '#config/default-squid-domains.js'

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

/**
 * @param {string[]} environments
 * @param {{ environments: Record<string, { squid: { domains: string[] } }> }} entity
 * @returns {{allowedRows: [envs: {id: string, domain: string, isDefault: boolean}], defaultRows: [envs: {id: string, domain: string, isDefault: boolean}]}}
 */
export function transformProxyRulesToRows(environments, entity) {
  const allDomains = [
    ...new Set(
      Object.entries(entity.environments).flatMap(
        ([_, { squid }]) => squid?.domains ?? []
      )
    )
  ]

  const allAllowedDomains = allDomains
    .filter((domain) => !defaultSquidDomains.includes(domain))
    .sort()

  const allDefaultDomains = allDomains
    .filter((domain) => defaultSquidDomains.includes(domain))
    .sort()

  const domainsByEnv = Object.fromEntries(
    Object.entries(entity.environments).map(([env, { squid }]) => [
      env,
      squid?.domains ?? []
    ])
  )

  const allowedRows = allAllowedDomains.map((domain) => ({
    envs: environments.map((env) => ({
      id: env,
      domain: domainsByEnv[env].includes(domain) ? domain : '',
      isDefault: false
    }))
  }))

  const defaultRows = allDefaultDomains.map((domain) => ({
    envs: environments.map((env) => ({
      id: env,
      domain: domainsByEnv[env].includes(domain) ? domain : '',
      isDefault: true
    }))
  }))

  return { allowedRows, defaultRows }
}
