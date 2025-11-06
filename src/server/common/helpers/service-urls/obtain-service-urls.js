import { sortKeyByEnv } from '../sort/sort-by-env.js'

function obtainServiceUrls(
  environmentDetails,
  availableServiceEnvironments = []
) {
  const urls = Object.entries(environmentDetails).flatMap(
    ([environmentName, details]) =>
      Object.entries(details.urls).map(([url, value]) => ({
        url,
        environment: environmentName,
        ...value
      }))
  )

  const shutteredUrls = urls
    .filter(({ shuttered }) => shuttered === true)
    .sort(sortKeyByEnv('environment'))

  const serviceUrls = urls
    .filter(({ environment }) =>
      availableServiceEnvironments.includes(environment)
    )
    .filter(({ type }) => type === 'internal')
    .sort(sortKeyByEnv('environment'))

  const vanityUrls = urls
    .filter(({ type }) => type === 'vanity')
    .sort(sortKeyByEnv('environment'))

  return {
    shutteredUrls,
    serviceUrls,
    vanityUrls
  }
}

export { obtainServiceUrls }
