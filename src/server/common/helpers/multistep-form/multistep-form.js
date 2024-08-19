import { provideSteps } from '~/src/server/common/helpers/multistep-form/provide-steps'
import { provideFormContextValues } from '~/src/server/common/helpers/multistep-form/provide-form-context-values'
import { provideMultistepFormId } from '~/src/server/common/helpers/multistep-form/provide-multistep-form-id'

const multistepForm = {
  name: 'multistepForm',
  multiple: true,
  version: '0.1.0',
  register: (server, options) => {
    server.ext([
      {
        type: 'onPreAuth',
        method: provideMultistepFormId,
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
        method: provideSteps(options.formSteps, options.isMultistepComplete),
        options: {
          sandbox: 'plugin'
        }
      }
    ])

    server.route(options.routes)
  }
}

export { multistepForm }
