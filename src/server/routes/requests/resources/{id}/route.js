import { scopes } from '@defra/cdp-validation-kit'
import { getResourceRequest } from '../../ResourcesService.js'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin, scopes.tenant]
    }
  }
}

export default async function (request) {
  const { id } = request.params

  const resourceRequest = await getResourceRequest(id)

  return {
    resourceRequest,
    breadcrumbs: [
      {
        text: 'Requests'
      },
      {
        text: 'Resources'
      },
      {
        text: resourceRequest.requestedAt
      }
    ]
  }
}
