import { provideSteps } from './provide-steps.js'
import { provideFormContextValues } from './provide-form-context-values.js'
import { requestHelpers } from './request-helpers.js'
import { checkSessionIsValid } from './check-session-is-valid.js'

const multistepForm = {
  name: 'multistepForm',
  multiple: true,
  version: '0.1.0',
  register: (server, options) => {
    const multistepFormExtensions = [
      {
        type: 'onPreAuth',
        method: requestHelpers(options.urlTemplates),
        options: { sandbox: 'plugin' }
      },
      {
        type: 'onPreAuth',
        method: checkSessionIsValid(options.urlTemplates),
        options: { sandbox: 'plugin' }
      },
      {
        type: 'onPostHandler',
        method: provideFormContextValues,
        options: { before: ['yar'], sandbox: 'plugin' }
      },
      {
        type: 'onPostHandler',
        method: provideSteps(options),
        options: { sandbox: 'plugin' }
      }
    ]

    if (options.ext?.length) {
      multistepFormExtensions.unshift(...options.ext)
    }

    server.ext(multistepFormExtensions)

    server.route(options.routes)
  }
}

export { multistepForm }
