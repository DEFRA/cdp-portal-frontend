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

  return {
    requestDetails: Object.entries(resourcesRequest.workflow).map(
      ([key, value]) => ({
        key: { text: formatText(key).replaceAll('-', ' ') },
        value: value?.startsWith?.('https://')
          ? { html: `<a href="${value}">${value}</a>` }
          : { text: value }
      })
    )
  }
}
