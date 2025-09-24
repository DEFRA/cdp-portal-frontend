import { config } from '../../../../../config/config.js'
import { removeNil } from '../../../../common/helpers/remove-nil.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

const userServiceBackendUrl = config.get('userServiceBackendUrl')

async function addMemberToTeam(request, teamId, userId) {
  const endpoint = `${userServiceBackendUrl}/teams/${teamId}/add/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

function editTeam(request, teamId, payload) {
  const endpoint = `${userServiceBackendUrl}/teams/${teamId}`

  return request.authedFetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      name: payload.name,
      description: payload.description,
      serviceCodes: payload.serviceCodes,
      alertEmailAddresses: payload.alertEmailAddresses,
      alertEnvironments: payload.alertEnvironments,
      github: payload.github
    })
  })
}

async function fetchCdpTeam(teamId) {
  const endpoint = `${userServiceBackendUrl}/teams/${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchCdpTeams() {
  const endpoint = `${userServiceBackendUrl}/teams`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint = `${userServiceBackendUrl}/teams/${teamId}/remove/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })
  return payload
}

async function searchCdpUsers(query) {
  const queryParams = query ? `?query=` + query : ''
  const endpoint = `${userServiceBackendUrl}/users${queryParams}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function searchGithubTeams(query) {
  const queryParams = query ? '?query=' + query : ''
  const endpoint = `${userServiceBackendUrl}/github-teams${queryParams}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export {
  editTeam,
  fetchCdpTeams,
  searchGithubTeams,
  fetchCdpTeam,
  searchCdpUsers,
  addMemberToTeam,
  removeMemberFromTeam
}
