import { sortKeyByEnv } from '../../../../common/helpers/sort/sort-by-env.js'

function obtainServiceUrls(environmentDetails) {
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
    .filter(({ type, shuttered }) => type === 'internal' && shuttered === false)
    .sort(sortKeyByEnv('environment'))

  const vanityUrls = urls
    .filter(({ type, shuttered }) => type === 'vanity' && shuttered === false)
    .sort(sortKeyByEnv('environment'))

  return {
    shutteredUrls,
    serviceUrls,
    vanityUrls
  }
}

export { obtainServiceUrls }
