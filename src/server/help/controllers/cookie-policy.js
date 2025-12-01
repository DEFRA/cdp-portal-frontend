import { getTraceId } from '@defra/hapi-tracing'

import { createLogger } from '../../common/helpers/logging/logger.js'

const outerLogger = createLogger()

const serverExtensionPoint = (extName) => (request, h) => {
  const traceId = getTraceId()
  const innerLogger = createLogger()

  request.logger.info(
    `Call from ${extName} extension point. getTraceId(): ${traceId}`
  )

  outerLogger.info(
    `OuterLogger call from ${extName} extension point. getTraceId(): ${traceId}`
  )
  innerLogger.info(
    `InnerLogger call from ${extName} extension point. getTraceId(): ${traceId}`
  )

  return h.continue
}

const cookiePolicy = {
  options: {
    id: 'help/cookies',
    ext: {
      onPreAuth: { method: serverExtensionPoint('onPreAuth') },
      onPostAuth: { method: serverExtensionPoint('onPostAuth') },
      onPreHandler: { method: serverExtensionPoint('onPreHandler') },
      onPostHandler: { method: serverExtensionPoint('onPostHandler') },
      onPreResponse: { method: serverExtensionPoint('onPreResponse') }
    }
  },
  handler: (_request, h) =>
    h.view('help/views/cookie-policy', {
      pageTitle: 'Cookie policy'
    })
}

export { cookiePolicy }
