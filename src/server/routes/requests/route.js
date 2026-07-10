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

  return {
    pendingResourceRequests,
    breadcrumbs: [
      {
        text: 'Requests'
      }
    ]
  }
}
