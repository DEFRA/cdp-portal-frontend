import qs from 'qs'

import { config } from '~/src/config/config.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

const userServiceBackendUrl = config.get('userServiceBackendUrl')

async function addScopeToTeam(request, teamId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/add/${teamId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return data
}

async function addScopeToUser(request, userId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/add/${userId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return data
}

function createScope(request, payload) {
  const endpoint = userServiceBackendUrl + '/scopes/admin/'

  return request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(removeNil(payload))
  })
}

async function fetchScope(request, scopeId) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  const { data } = await request.authedFetcher(endpoint)
  return data
}

async function fetchScopes(request) {
  const endpoint = userServiceBackendUrl + '/scopes/admin'

  const { data } = await request.authedFetcher(endpoint)
  return data
}

async function searchCdpUsers(query) {
  const queryString = query
    ? qs.stringify({ query }, { addQueryPrefix: true })
    : ''
  const endpoint = `${userServiceBackendUrl}/users${queryString}`

  const { data } = await fetcher(endpoint)
  return data
}

async function searchCdpTeams(query) {
  const queryString = query
    ? qs.stringify({ query }, { addQueryPrefix: true })
    : ''
  const endpoint = `${userServiceBackendUrl}/teams${queryString}`

  const { data } = await fetcher(endpoint)
  return data
}

function updateScope(request, scopeId, payload) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  return request.authedFetcher(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(removeNil(payload))
  })
}

async function removeScopeFromTeam(request, teamId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/remove/${teamId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch'
  })
  return data
}

async function removeScopeFromUser(request, userId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/remove/${userId}`

  const { data } = await request.authedFetcher(endpoint, {
    method: 'patch'
  })
  return data
}

async function deleteScope(request, scopeId) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  const { response } = await request.authedFetcher(endpoint, {
    method: 'delete'
  })
  return response
}

export {
  addScopeToTeam,
  addScopeToUser,
  createScope,
  fetchScope,
  fetchScopes,
  searchCdpUsers,
  searchCdpTeams,
  updateScope,
  removeScopeFromTeam,
  removeScopeFromUser,
  deleteScope
}
