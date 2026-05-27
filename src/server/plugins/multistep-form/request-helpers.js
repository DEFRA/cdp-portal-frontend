import { randomUUID } from 'node:crypto'

import { populatePathParams } from './populate-path-params.js'
import { saveStepDataRequestHelper } from './save-step-data.js'
import { sessionNames } from '#server/common/constants/session-names.js'

function requestHelpers(urlTemplates, sessionName) {
  return (request, h) => {
    if (!sessionName) {
      request.app.multiStepFormId =
        request.params?.multiStepFormId || randomUUID()
    }

    request.app.initStepData = () => {
      request.yar.clear(sessionName)
      request.yar.clear(sessionNames.validationFailure)
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

    return step?.at(0)
  }
}

export { requestHelpers }
