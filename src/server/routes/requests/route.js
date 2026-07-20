import { scopes } from '@defra/cdp-validation-kit'
import {
  getPendingResourceRequests,
  getRecentNonPendingResourceRequests
} from './ResourceRequestsService.js'
import { parseISO, subMinutes } from 'date-fns'
import { fetchCdpUser } from '#server/admin/users/helpers/fetch/fetchers.js'
import { formatStatus, statusTagColour } from './utils.js'

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

  const teamsFilter = userIsAdmin
    ? []
    : cdpUser.teams.map(({ teamId }) => teamId)

  const [pendingResourceRequests, recentNonPendingResourceRequests] =
    await Promise.all([
      getPendingResourceRequests(teamsFilter),
      getRecentNonPendingResourceRequests(teamsFilter)
    ])

  const hasGeneratingRequests = pendingResourceRequests.some(
    (request) => request.status === 'pending'
  )

  const now = Date.now()
  const hasGeneratingRequestsTakingTooLong = pendingResourceRequests.some(
    (request) =>
      request.status === 'pending' &&
      parseISO(request.requestedAt) < subMinutes(now, 20)
  )

  const hasGeneratingRequestsFailed = recentNonPendingResourceRequests.some(
    (request) => request.status === 'failed'
  )

  return {
    pendingOrRecentResourceRequests: [
      ...pendingResourceRequests,
      ...recentNonPendingResourceRequests
    ].toSorted((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt)),
    hasGeneratingRequests,
    hasGeneratingRequestsTakingTooLong,
    hasGeneratingRequestsFailed,
    formatStatus,
    statusTagColour,
    breadcrumbs: [
      {
        text: 'Requests'
      }
    ]
  }
}
