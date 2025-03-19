import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchTeamServices(teamId) {
  const endpoint = portalBackendUrl + `/services?teamId=${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchTeamTestSuites(teamId) {
  const endpoint = portalBackendUrl + `/test-suites?teamId=${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchTeamRepositories(teamId) {
  const endpoint = portalBackendUrl + `/repositories/all/${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTeamServices, fetchTeamTestSuites, fetchTeamRepositories }
