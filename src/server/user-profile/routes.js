import { userProfileController } from './controllers/profile.js'
import { generateApiKeyController } from './controllers/generate-api-key.js'
import { provideFormContextValues } from '../common/helpers/multistep-form/provide-form-context-values.js'

const userProfile = {
  plugin: {
    name: 'userProfile',
    register: async (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues,
          options: { before: ['yar'], sandbox: 'plugin' }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/user-profile',
          ...userProfileController
        },
        {
          method: 'POST',
          path: '/user-profile/generate-api-key',
          ...generateApiKeyController
        }
      ])
    }
  }
}

export { userProfile }
