import { sortKeyByEnv } from './sort/sort-by-env.js'

function obtainApiHubUrls(entity, availableServiceEnvironments) {
  const hasApiDocs = Boolean(entity?.metadata?.api_docs)

  if (!hasApiDocs) {
    return []
  }

  return availableServiceEnvironments
    .filter((environment) => Boolean(entity?.environments?.[environment]))
    .map((environment) => ({
      environment,
      url: `https://cdp-api-hub.${environment}.cdp-int.defra.cloud/hub/internal/${entity.name}`
    }))
    .sort(sortKeyByEnv('environment'))
}

export { obtainApiHubUrls }
