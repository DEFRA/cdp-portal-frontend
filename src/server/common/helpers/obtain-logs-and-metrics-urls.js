import { sortKeyByEnv } from './sort/sort-by-env.js'

function obtainLogsAndMetricsUrls(
  environmentDetails,
  availableServiceEnvironments
) {
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
      metrics: details.metrics
    }))
    .sort(sortKeyByEnv('environment'))
    .reduce((metricsLinks, { environment, metrics }) => {
      metricsLinks[environment] = metrics
      return metricsLinks
    }, {})

  return { logsDetails, metricsDetails }
}

export { obtainLogsAndMetricsUrls }
