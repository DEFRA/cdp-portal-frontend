import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchMigrationRun(migrationId) {
  const endpoint = `${portalBackendUrl}/migrations/runs/${migrationId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

/**
 * @typedef {object} QueryParams
 * @property {string} cdpMigrationId
 * @property {string} buildId
 * @property {string} service
 * @property {string} environment
 * @property {string} status
 * @param {QueryParams} queryParams
 * @returns {Promise<*>}
 */
async function fetchMigrations(queryParams) {
  const params = queryParams
    ? qs.stringify(queryParams, { addQueryPrefix: true })
    : null

  const endpoint = `${portalBackendUrl}/migrations/runs${params ?? ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchMigrationRun, fetchMigrations }
