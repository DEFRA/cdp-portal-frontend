import { randomUUID } from 'node:crypto'

import { populatePathParams } from './populate-path-params.js'
import { saveStepDataRequestHelper } from './save-step-data.js'

function requestHelpers(urlTemplates, sessionName) {
  return (request, h) => {
    if (!sessionName) {
      request.app.multiStepFormId =
        request.params?.multiStepFormId || randomUUID()
    }

    request.app.saveStepData = saveStepDataRequestHelper(
      request,
      getStepNameByPath(urlTemplates),
      sessionName
    )

    request.app.getStepData = () =>
      request.yar.get(sessionName ?? request.app?.multiStepFormId) ?? {}

    request.logger.debug(
      `Multistep Form Id: ${sessionName ?? request.app.multiStepFormId}`
    )

    return h.continue
  }
}

function getStepNameByPath(urlTemplates) {
  return ({ path, params }) => {
    const step = Object.entries(urlTemplates).find(([, urlTemplate]) =>
      path.startsWith(populatePathParams(params, urlTemplate))
    )
    console.log(path, urlTemplates, params, step)
    return step?.at(0)
  }
}

export { requestHelpers }
