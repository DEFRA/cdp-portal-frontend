import { sortKeyByEnv } from '#server/common/helpers/sort/sort-by-env.js'

function obtainApiHubUrls(entity, availableServiceEnvironments) {
  const hasApiDocs = Boolean(entity?.metadata?.api_docs)

  if (!hasApiDocs) {
    return []
  }

  const apiHubUrls = availableServiceEnvironments
    .filter((environment) => Boolean(entity?.environments?.[environment]))
    .map((environment) => ({
      environment,
      urls: [
        {
          url: `https://cdp-api-hub.${environment}.cdp-int.defra.cloud/hub/internal/${entity.name}`
        }
      ]
    }))
    .sort(sortKeyByEnv('environment'))

  return { apiHubUrls }
}

export { obtainApiHubUrls }
