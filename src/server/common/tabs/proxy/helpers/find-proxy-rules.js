import { fetchProxyRules } from '~/src/server/services/helpers/fetch/fetch-proxy-rules.js'
import { transformProxyRules } from '~/src/server/common/tabs/proxy/transformers/transform-proxy-rules.js'

/**
 * Find proxy rules for a service in all environments
 * @param {string} serviceName
 * @param {string[]} environments
 * @returns {Promise<{ environment: string, rules: object }[]>}
 */
async function findAllProxyRules(serviceName, environments) {
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
  const rules = await fetchProxyRules(serviceName, environment)

  return transformProxyRules({ environment, rules })
}

export { findAllProxyRules, findProxyRulesForEnvironment }
