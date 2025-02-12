import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchTeamServices(teamId) {
  const endpoint = portalBackendUrl + `/services?teamId=${teamId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

async function fetchTeamTestSuites(teamId) {
  const endpoint = portalBackendUrl + `/test-suite?teamId=${teamId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

async function fetchTeamRepositories(teamId) {
  const endpoint = portalBackendUrl + `/repositories/all/${teamId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchTeamServices, fetchTeamTestSuites, fetchTeamRepositories }
