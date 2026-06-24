import { formatText } from '#config/nunjucks/filters/filters.js'
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
  const { workflow } = resourcesRequest ?? {}

  // if (!workflowId) {
  //   return h.redirect('/create')
  // }

  const prUrl = ''

  return {
    workflow,
    prUrl
  }
}
