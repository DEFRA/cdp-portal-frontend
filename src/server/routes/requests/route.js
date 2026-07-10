import { scopes } from '@defra/cdp-validation-kit'
import { getPendingResourceRequests } from './ResourcesService.js'
import { parseISO, subMinutes } from 'date-fns'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin] // TODO: open to tenants
    }
  }
}

export default async function (request) {
  const pendingResourceRequests = await getPendingResourceRequests()

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
