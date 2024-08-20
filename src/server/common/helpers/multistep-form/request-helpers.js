import { randomUUID } from 'node:crypto'
import { saveStepDataRequestHelper } from '~/src/server/common/helpers/multistep-form/save-step-data'

function requestHelpers(urls) {
  return (request, h) => {
    request.app.multiStepFormId =
      request.params?.multiStepFormId || randomUUID()

    request.app.saveStepData = saveStepDataRequestHelper(
      request,
      getStepByPath(urls)
    )

    request.logger.debug(`Multistep Form Id: ${request.app.multiStepFormId}`)

    return h.continue
  }
}

function getStepByPath(urls) {
  return (path) => {
    const result = Object.entries(urls).find(([, url]) => path.startsWith(url))
    return result.at(0)
  }
}

export { requestHelpers }
