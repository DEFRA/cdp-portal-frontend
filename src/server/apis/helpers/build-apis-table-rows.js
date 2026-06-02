import { entityToApiRow } from '../transformers/entity-to-api-row.js'

function buildApisTableRows({ services = [], runningServices, environments }) {
  const runningEnvsByService = (runningServices ?? []).reduce((acc, rs) => {
    if (!acc[rs.service]) {
      acc[rs.service] = new Set()
    }
    acc[rs.service].add(rs.environment)
    return acc
  }, {})

  return services
    .filter((entity) => Boolean(entity?.metadata?.api_docs))
    .map((entity) => entityToApiRow(entity, environments, runningEnvsByService))
    .filter((row) => row.hasLinks)
    .sort((a, b) => a.serviceName.localeCompare(b.serviceName))
}

export { buildApisTableRows }
