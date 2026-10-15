import { defaultSquidDomains } from '#config/default-squid-domains.js'

const stsDomainPostfix = '.tokens.sts.global.api.aws'

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
    .filter(
      (domain) =>
        defaultSquidDomains.includes(domain) &&
        !domain.endsWith(stsDomainPostfix)
    )
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

  // Special case to group sts domains
  let stsDomainFound = false
  const stsDomainRow = {
    envs: environments.map((env) => {
      const match = domainsByEnv[env].find((dom) =>
        dom.endsWith(stsDomainPostfix)
      )
      if (!stsDomainFound && match) {
        stsDomainFound = true
      }

      return {
        id: env,
        domain: match ?? '',
        isDefault: true
      }
    })
  }

  if (stsDomainFound) {
    defaultRows.push(stsDomainRow)
    // Approx sort based on first value
    defaultRows.sort((a, b) =>
      a?.envs[0]?.domain?.localeCompare(b?.envs[0]?.domain)
    )
  }

  return { allowedRows, defaultRows }
}
