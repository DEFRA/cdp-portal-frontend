import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import qs from 'qs'

const portalBackendUrl = config.get('portalBackendUrl')

function decommission(repositoryName, user) {
  const { id, displayName } = user
  const queryString = qs.stringify(
    { id, displayName },
    { addQueryPrefix: true }
  )

  const endpoint = `${portalBackendUrl}/entities/${repositoryName}/decommission${queryString}`

  return fetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
}

// TODO - remove try catch once endpoints are there
async function fetchDecommissions() {
  const endpoint = `${portalBackendUrl}/entities/decommissions`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    return []
  }
}

// TODO - remove try catch once endpoints are there
async function fetchDecommission(repositoryName) {
  const endpoint = `${portalBackendUrl}/entities/decommissions/${repositoryName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    return {}
  }
}

export { decommission, fetchDecommissions, fetchDecommission }
