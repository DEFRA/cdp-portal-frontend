import { scopes } from '@defra/cdp-validation-kit'
import { getResourceRequest } from '../../ResourceRequestsService.js'
import { formatDate } from 'date-fns'
import { formatStatus, statusTagColour } from '../../utils.js'

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
    formatStatus,
    statusTagColour,
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
