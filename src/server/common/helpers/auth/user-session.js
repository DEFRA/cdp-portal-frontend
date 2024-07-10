import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

import { config } from '~/src/config'
import { isUserInAServiceTeam } from '~/src/server/common/helpers/user/is-user-in-a-service-team'
import { scopes } from '~/src/server/common/constants/scopes'
import { fetchTeams } from '~/src/server/teams/helpers/fetch'

function removeAuthenticatedUser(request) {
  request.dropUserSession()
  request.sessionCookie.clear()
  request.sessionCookie.h
    .response()
    .unstate('csrfToken')
    .unstate('userSession')
    .unstate('cdpPortalSession')
}

async function createUserSession(request, sessionId) {
  const expiresInSeconds = request.auth.credentials.expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { teams } = await fetchTeams(true)
  const { profile } = request.auth.credentials
  const userGroups = profile.groups?.slice()

  const isAdmin = userGroups.includes(config.get('oidcAdminGroupId'))
  if (isAdmin) {
    userGroups.push(scopes.admin)
  }

  const isServiceTeamUser = await isUserInAServiceTeam(teams, userGroups)
  if (isServiceTeamUser) {
    userGroups.push(scopes.serviceTeamUser)
  }

  await request.server.app.cache.set(sessionId, {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    loginHint: profile.loginHint,
    isAuthenticated: request.auth.isAuthenticated,
    token: request.auth.credentials.token,
    refreshToken: request.auth.credentials.refreshToken,
    isAdmin,
    isServiceTeamUser,
    scope: userGroups,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })
}

async function provideCdpGroupDetail(groups = []) {
  const { teams: teamsWithGithub } = await fetchTeams(true)
  const teamIds = teamsWithGithub?.map((team) => team.teamId) ?? []

  return {
    teams: teamsWithGithub,
    userGroups: groups.slice().filter((group) => teamIds.includes(group))
  }
}

async function updateUserSession(request, refreshedSession) {
  request.logger.debug('User session updating')

  const refreshedPayload = jwt.token.decode(refreshedSession.access_token)
    .decoded.payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshedSession.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { teams, userGroups } = await provideCdpGroupDetail(
    refreshedPayload.groups
  )

  const isAdmin = userGroups.includes(config.get('oidcAdminGroupId'))
  if (isAdmin) {
    userGroups.push(scopes.admin)
  }

  const isServiceTeamUser = await isUserInAServiceTeam(teams, userGroups)
  if (isServiceTeamUser) {
    userGroups.push(scopes.serviceTeamUser)
  }

  await request.server.app.cache.set(request.state.userSession.sessionId, {
    id: refreshedPayload.oid,
    email: refreshedPayload.preferred_username,
    displayName: refreshedPayload.name,
    loginHint: refreshedPayload.login_hint,
    isAuthenticated: true,
    token: refreshedSession.access_token,
    refreshToken: refreshedSession.refresh_token,
    isAdmin,
    isServiceTeamUser,
    scope: userGroups,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })

  request.logger.debug('User session updated')
  return await request.getUserSession()
}

export { createUserSession, updateUserSession, removeAuthenticatedUser }
