import { sortKeyByEnv } from './sort/sort-by-env.js'

function obtainLogsAndMetricsUrls(environmentDetails) {
  const logsDetails = Object.entries(environmentDetails)
    .flatMap(([environment, details]) => ({ environment, ...details.logs }))
    .sort(sortKeyByEnv('environment'))

  const metricsDetails = Object.entries(environmentDetails).reduce(
    (metricUrls, [environment, details]) => {
      return {
        ...metricUrls,
        [environment]: details.metrics
      }
    },
    {}
  )

  return { logsDetails, metricsDetails }
}

export { obtainLogsAndMetricsUrls }
