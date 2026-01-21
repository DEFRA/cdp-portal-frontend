import { sortKeyByEnv } from './sort/sort-by-env.js'
import { basename } from 'node:path'

function obtainLogsAndMetricsUrls(entity, availableServiceEnvironments) {
  const environmentDetails = entity.environments
  const logsDetails = Object.entries(environmentDetails)
    .filter(([environment]) =>
      availableServiceEnvironments.includes(environment)
    )
    .flatMap(([environment, details]) => ({ environment, ...details.logs }))
    .sort(sortKeyByEnv('environment'))

  const metricsDetails = Object.entries(environmentDetails)
    .filter(([environment]) =>
      availableServiceEnvironments.includes(environment)
    )
    .map(([environment, details]) => ({
      environment,
      metrics: details.metrics?.map((m) => addMetricsTitle(entity.name, m))
    }))
    .sort(sortKeyByEnv('environment'))
    .reduce((metricsLinks, { environment, metrics }) => {
      metricsLinks[environment] = metrics
      return metricsLinks
    }, {})

  return { logsDetails, metricsDetails }
}

/**
 * Replaces the type field for custom dashboards with a more meaningful name.
 * Custom dashboards follow a naming convention `${service}-${dashboard-name}`.
 * Non-custom dashboards are returned unmodified
 * @param {string} name
 * @param {{type: string, url: string}} metrics
 * @return {{type: string, url: string}[]}
 */
function addMetricsTitle(name, metrics) {
  if (metrics.type === 'custom') {
    metrics.type = basename(metrics.url).replace(name + '-', '')
  }
  return metrics
}

export { obtainLogsAndMetricsUrls }
