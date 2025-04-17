import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchMigrations(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/migrations/available/${serviceName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchMigrations }
