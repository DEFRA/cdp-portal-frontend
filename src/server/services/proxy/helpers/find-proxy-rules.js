import { fetchEnvironmentProxyRules } from '~/src/server/services/helpers/fetch/fetch-all-proxy-rules.js'

/**
 * Find proxy rules for a service in all environments
 * @param {string} serviceName
 * @param {string[]} environments
 * @returns {Promise<{ environment: string, rules: object }[]>}
 */
async function findAllProxyRules(serviceName, environments) {
  //
  const environmentProxyRules = environments.map((environment) => {
    return findProxyRulesForEnvironment(serviceName, environment)
  })
  return Promise.all(environmentProxyRules)
}

/**
 * Find proxy rules for a service in all environments
 * @param {string} serviceName
 * @param {string} environment
 * @returns {Promise<{ environment: string, rules: object }>}
 */
async function findProxyRulesForEnvironment(serviceName, environment) {
  const rules = await fetchEnvironmentProxyRules(serviceName, environment)
  return transformProxyRules({ environment, rules })
}

function transformProxyRules({ environment, rules }) {
  const allowedDomains = rules.allowedDomains ?? []
  const defaultDomains = rules.defaultDomains ?? []
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

export { findAllProxyRules, findProxyRulesForEnvironment }
