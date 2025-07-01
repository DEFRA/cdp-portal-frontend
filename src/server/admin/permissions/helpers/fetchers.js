import qs from 'qs'

import { config } from '~/src/config/config.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

const userServiceBackendUrl = config.get('userServiceBackendUrl')

async function addScopeToTeam(request, teamId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/add/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

async function addScopeToUser(request, userId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/add/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

function createScope(request, payload) {
  const endpoint = userServiceBackendUrl + '/scopes/admin/'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: removeNil(payload)
  })
}

async function fetchPermissionsScope(request, scopeId) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function fetchPermissionsScopeByName(request, scopeName) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/name/${scopeName}`

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function fetchPermissionsScopes(request) {
  const endpoint = userServiceBackendUrl + '/scopes/admin'

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function searchCdpUsers(query) {
  const queryString = query
    ? qs.stringify({ query }, { addQueryPrefix: true })
    : ''
  const endpoint = `${userServiceBackendUrl}/users${queryString}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function searchCdpTeams(query) {
  const queryString = query
    ? qs.stringify({ query }, { addQueryPrefix: true })
    : ''
  const endpoint = `${userServiceBackendUrl}/teams${queryString}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

function updateScope(request, scopeId, payload) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  return request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    payload: removeNil(payload)
  })
}

async function removeScopeFromTeam(request, teamId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/remove/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })
  return payload
}

async function removeScopeFromUser(request, userId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/remove/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })

  request.yar.flash(sessionNames.notifications, {
    text: 'Permission removed from user',
    type: 'success'
  })

  request.audit.sendMessage({
    event: `permission: ${scopeId} removed from user: ${userId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
    data: {
      userId,
      scopeId
    },
    user: request.pre.authedUser
  })

  return payload
}

function deleteScope(request, scopeId) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  return request.authedFetchJson(endpoint, {
    method: 'delete'
  })
}

export {
  addScopeToTeam,
  addScopeToUser,
  createScope,
  fetchPermissionsScope,
  fetchPermissionsScopeByName,
  fetchPermissionsScopes,
  searchCdpUsers,
  searchCdpTeams,
  updateScope,
  removeScopeFromTeam,
  removeScopeFromUser,
  deleteScope
}
