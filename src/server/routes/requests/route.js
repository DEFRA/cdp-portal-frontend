import { scopes } from '@defra/cdp-validation-kit'
import { getPendingResourceRequests } from './ResourcesService.js'

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

  return {
    pendingResourceRequests,
    hasGeneratingRequests,
    breadcrumbs: [
      {
        text: 'Requests'
      }
    ]
  }
}
