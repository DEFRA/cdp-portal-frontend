import qs from 'qs'

import { config } from '../../../../config/config.js'
import { removeNil } from '../../../common/helpers/remove-nil.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

const userServiceBackendUrl = config.get('userServiceBackendUrl')

async function addScopeToTeam({ request, teamId, scopeId }) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/add/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

async function addScopeToUser({ request, userId, scopeId }) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/add/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  return payload
}

async function addScopeToMember({
  request,
  userId,
  scopeId,
  teamId,
  payload = {}
}) {
  const endpoint =
    userServiceBackendUrl +
    `/scopes/admin/${scopeId}/member/add/${userId}/team/${teamId}`

  const response = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    payload: removeNil(payload)
  })

  return response?.payload
}

async function addBreakGlassToMember({ request, userId, teamId, reason }) {
  const endpoint =
    userServiceBackendUrl + `/users/${userId}/add-break-glass/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    payload: removeNil({
      reason
    })
  })

  return payload
}

async function fetchPermission(request, scopeId) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/${scopeId}`

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function fetchPermissionByName(request, scopeName) {
  const endpoint = userServiceBackendUrl + `/scopes/admin/name/${scopeName}`

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function fetchPermissions(request) {
  const endpoint = userServiceBackendUrl + '/scopes/admin'

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function fetchActiveBreakGlass(request) {
  const endpoint = userServiceBackendUrl + '/scopes/active-break-glass'

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

async function removeScopeFromTeam(request, teamId, scopeId) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/team/remove/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })
  return payload
}

async function removeScopeFromUser({ request, userId, scopeId }) {
  const endpoint =
    userServiceBackendUrl + `/scopes/admin/${scopeId}/user/remove/${userId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })

  return payload
}

async function removeScopeFromMember({ request, userId, scopeId, teamId }) {
  const endpoint =
    userServiceBackendUrl +
    `/scopes/admin/${scopeId}/member/remove/${userId}/team/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })

  return payload
}

async function removeBreakGlassFromMember({ request, userId, teamId }) {
  const endpoint =
    userServiceBackendUrl + `/users/${userId}/remove-break-glass/${teamId}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'patch'
  })

  return payload
}

export {
  addScopeToTeam,
  addScopeToUser,
  addScopeToMember,
  addBreakGlassToMember,
  fetchPermission,
  fetchPermissionByName,
  fetchPermissions,
  fetchActiveBreakGlass,
  searchCdpUsers,
  searchCdpTeams,
  removeScopeFromTeam,
  removeScopeFromUser,
  removeScopeFromMember,
  removeBreakGlassFromMember
}
