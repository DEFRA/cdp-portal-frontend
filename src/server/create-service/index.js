import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { scopes } from '~/src/server/common/constants/scopes'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'
import {
  createServiceController,
  createServiceFormController
} from '~/src/server/create-service/controllers'

const serviceTeamUserScope = authScope(`+${scopes.serviceTeamUser}`)

const createService = {
  plugin: {
    name: 'create service',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/create-service',
            ...createServiceFormController
          },
          {
            method: 'POST',
            path: '/create-service',
            ...createServiceController
          }
        ].map(serviceTeamUserScope)
      )
    }
  }
}

export { createService }
