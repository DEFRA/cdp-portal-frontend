import { randomUUID } from 'node:crypto'

function provideMultistepFormId(request, h) {
  request.app.multiStepFormId = request.params?.multiStepFormId || randomUUID()

  request.logger.debug(`Multistep Form Id: ${request.app.multiStepFormId}`)

  return h.continue
}

export { provideMultistepFormId }
