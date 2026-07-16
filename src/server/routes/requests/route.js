import { scopes } from '@defra/cdp-validation-kit'
import { getPendingResourceRequests } from './ResourcesService.js'
import { parseISO, subMinutes } from 'date-fns'
import { fetchCdpUser } from '#server/admin/users/helpers/fetch/fetchers.js'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin, scopes.tenant]
    }
  }
}

export default async function (request) {
  const userIsAdmin = await request.userIsAdmin()

  let cdpUser
  if (!userIsAdmin) {
    const userSession = request.auth.credentials
    cdpUser = await fetchCdpUser(userSession.id)
  }

  const pendingResourceRequests = await getPendingResourceRequests(
    userIsAdmin ? [] : cdpUser.teams.map(({ teamId }) => teamId)
  )

  const hasGeneratingRequests = pendingResourceRequests.some(
    (request) => request.status === 'pending'
  )

  const now = Date.now()
  const hasGeneratingRequestsTakingTooLong = pendingResourceRequests.some(
    (request) =>
      request.status === 'pending' &&
      parseISO(request.requestedAt) < subMinutes(now, 20)
  )

  return {
    pendingResourceRequests,
    hasGeneratingRequests,
    hasGeneratingRequestsTakingTooLong,
    breadcrumbs: [
      {
        text: 'Requests'
      }
    ]
  }
}
