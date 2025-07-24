import { provideSteps } from './provide-steps.js'
import { provideFormContextValues } from './provide-form-context-values.js'
import { requestHelpers } from './request-helpers.js'

const multistepForm = {
  name: 'multistepForm',
  multiple: true,
  version: '0.1.0',
  register: (server, options) => {
    server.ext([
      {
        type: 'onPreAuth',
        method: requestHelpers(options.urls),
        options: {
          sandbox: 'plugin'
        }
      },
      {
        type: 'onPostHandler',
        method: provideFormContextValues,
        options: { before: ['yar'], sandbox: 'plugin' }
      },
      {
        type: 'onPostHandler',
        method: provideSteps(options),
        options: {
          sandbox: 'plugin'
        }
      }
    ])

    server.route(options.routes)
  }
}

export { multistepForm }
