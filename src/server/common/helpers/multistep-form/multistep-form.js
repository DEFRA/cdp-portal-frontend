import { provideSteps } from '~/src/server/common/helpers/multistep-form/provide-steps.js'
import { provideFormContextValues } from '~/src/server/common/helpers/multistep-form/provide-form-context-values.js'
import { requestHelpers } from '~/src/server/common/helpers/multistep-form/request-helpers.js'

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
        method: provideSteps(options.formSteps, options.urls),
        options: {
          sandbox: 'plugin'
        }
      }
    ])

    server.route(options.routes)
  }
}

export { multistepForm }
