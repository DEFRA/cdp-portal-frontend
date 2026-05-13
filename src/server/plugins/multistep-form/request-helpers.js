import { randomUUID } from 'node:crypto'

import { populatePathParams } from './populate-path-params.js'
import { saveStepDataRequestHelper } from './save-step-data.js'

function requestHelpers(urlTemplates) {
  return (request, h) => {
    request.app.multiStepFormId =
      request.params?.multiStepFormId || randomUUID()

    request.app.saveStepData = saveStepDataRequestHelper(
      request,
      getStepNameByPath(urlTemplates)
    )

    request.logger.debug(`Multistep Form Id: ${request.app.multiStepFormId}`)

    return h.continue
  }
}

function getStepNameByPath(urlTemplates) {
  return ({ path, params }) => {
    const step = Object.entries(urlTemplates).find(([, urlTemplate]) =>
      path.startsWith(populatePathParams(params, urlTemplate))
    )
    return step?.at(0)
  }
}

export { requestHelpers }
