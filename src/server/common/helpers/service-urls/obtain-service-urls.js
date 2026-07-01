import { sortKeyByEnv } from '../sort/sort-by-env.js'

function obtainServiceUrls(environmentDetails, availableEnvs = []) {
  const environmentUrls = Object.entries(environmentDetails).map(
    ([environment, details]) => ({
      environment,
      urls: Object.entries(details.urls ?? {}).map(([url, value]) => ({
        url: `https://${url}`,
        ...value
      }))
    })
  )

  const environmentFilter = (item) =>
    availableEnvs.length === 0 || availableEnvs.includes(item.environment)

  return {
    serviceUrls: environmentUrls
      .filter(environmentFilter)
      .map(({ environment, urls }) => ({
        environment,
        urls: urls.filter(
          ({ type, ingress_type }) =>
            type === 'internal' && ingress_type === 'nginx'
        )
      }))
      // .filter(({ urls }) => urls.length > 0)
      .sort(sortKeyByEnv('environment')),

    vanityUrls: environmentUrls
      .filter(environmentFilter)
      .map(({ environment, urls }) => ({
        environment,
        urls: urls.filter(({ type }) => type === 'vanity')
      }))
      .filter(({ urls }) => urls.length > 0)
      .sort(sortKeyByEnv('environment')),

    apiUrls: environmentUrls
      .filter(environmentFilter)
      .map(({ environment, urls }) => ({
        environment,
        urls: urls.filter(({ ingress_type }) => ingress_type === 'api_gateway')
      }))
      .filter(({ urls }) => urls.length > 0)
      .sort(sortKeyByEnv('environment'))
  }
}

export { obtainServiceUrls }
