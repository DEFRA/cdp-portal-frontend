import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  }
}

export default async function (request, h) {
  const resourcesRequest = request.yar.get(sessionNames.resourcesRequest)

  return {
    resourcesRequest
  }
}
