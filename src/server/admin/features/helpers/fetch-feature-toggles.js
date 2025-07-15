import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { config } from '~/src/config/config.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchFeatureToggles() {
  const endpoint = `${portalBackendUrl}/feature-toggles`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function updateFeatureToggle(request, featureToggleId, active) {
  const endpoint = `${portalBackendUrl}/feature-toggles/${featureToggleId}/${active}`

  await request.authedFetchJson(endpoint, {
    method: 'put'
  })
}

async function isFeatureToggleActiveForPath(requestPath) {
  const endpoint = `${portalBackendUrl}/feature-toggles/${encodeURIComponent(requestPath)}`

  const { payload } = await fetchJson(endpoint)
  return payload
}
export {
  fetchFeatureToggles,
  isFeatureToggleActiveForPath,
  updateFeatureToggle
}
