import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

const userServiceBackendUrl = config.get('userServiceBackendUrl')

async function fetchCdpUser(userId) {
  const endpoint = `${userServiceBackendUrl}/users/${userId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchCdpUsers() {
  const endpoint = `${userServiceBackendUrl}/users`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function searchAzureActiveDirectoryUsers(query) {
  const queryParams = query ? '?query=' + query : ''
  const endpoint = `${userServiceBackendUrl}/aad-users${queryParams}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function searchGithubUsers(query) {
  const queryParams = query ? '?query=' + query : ''
  const endpoint = `${userServiceBackendUrl}/github-users${queryParams}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export {
  fetchCdpUser,
  fetchCdpUsers,
  searchAzureActiveDirectoryUsers,
  searchGithubUsers
}
