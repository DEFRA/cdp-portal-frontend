import { scopes } from '@defra/cdp-validation-kit'
import { getResourceRequest } from '../../ResourcesService.js'
import { formatDate } from 'date-fns'

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
        text: 'Requests',
        href: '/requests'
      },
      {
        text: 'Resources'
      },
      {
        text: formatDate(
          resourceRequest.requestedAt,
          "do MMM yyyy 'at' HH:mm:ss"
        )
      }
    ]
  }
}
