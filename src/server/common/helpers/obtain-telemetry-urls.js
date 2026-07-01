import { sortKeyByEnv } from './sort/sort-by-env.js'
import { basename } from 'node:path'
import startCase from 'lodash/startCase.js'

function obtainTelemetryUrls(entity, availableServiceEnvironments) {
  const environmentDetails = entity.environments
  const logsUrls = Object.entries(environmentDetails)
    .filter(([environment]) =>
      availableServiceEnvironments.includes(environment)
    )
    .map(([environment, details]) => ({
      environment,
      urls: [
        {
          label: `https://logs.${environment}.cdp-int.defra.cloud`,
          testId: 'app-logs-dashboard-link',
          ...(details.logs ?? {})
        }
      ]
    }))
    .sort(sortKeyByEnv('environment'))

  const metricsUrls = Object.entries(environmentDetails)
    .filter(([environment]) =>
      availableServiceEnvironments.includes(environment)
    )
    .map(([environment, details]) => ({
      environment,
      urls: details.metrics?.map((m) => {
        const metrics = replaceCustomType(entity.name, m)
        return {
          label: `${startCase(metrics.type)} - https://metrics.${environment}.cdp-int.defra.cloud`,
          ...metrics
        }
      })
    }))
    .sort(sortKeyByEnv('environment'))

  return { logsUrls, metricsUrls }
}

/**
 * Replaces the type field for custom dashboards with a more meaningful name.
 * Custom dashboards follow a naming convention `${service}-${dashboard-name}`.
 * Non-custom dashboards are returned unmodified
 * @param {string} name
 * @param {{type: string, url: string}} metrics
 * @return {{type: string, url: string}[]}
 */
function replaceCustomType(name, metrics) {
  if (metrics.type === 'custom') {
    metrics.type = basename(metrics.url).replace(name + '-', '')
  }
  return metrics
}

export { obtainTelemetryUrls }
