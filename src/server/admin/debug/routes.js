import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { entityDebugController } from './controllers/entity-debug-controller.js'
import { debugController } from './controllers/debug-controller.js'
import { deploymentDebugController } from './controllers/deployment-debug-controller.js'
import { entitiesDebugController } from './controllers/entities-debug-controller.js'
import { republishPlatformStateMessagesController } from './controllers/republish-platform-state-controller.js'
import { debugRedirectController } from './controllers/debug-redirect-controller.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'

const adminUserScope = authScope([scopes.admin])

const adminDebug = {
  plugin: {
    name: 'adminDebug',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/debug',
            ...debugController
          },
          {
            method: 'POST',
            path: '/admin/debug/{endpointPath}',
            ...debugRedirectController
          },
          {
            method: 'GET',
            path: '/admin/debug/entities',
            ...entitiesDebugController
          },
          {
            method: 'GET',
            path: '/admin/debug/entities/{entityName}',
            ...entityDebugController
          },
          {
            method: 'GET',
            path: '/admin/debug/deployment/{deploymentId}',
            ...deploymentDebugController
          },
          {
            method: 'GET',
            path: '/admin/debug/republish-platform-state-messages',
            ...republishPlatformStateMessagesController
          }
        ].map(adminUserScope)
      )
    }
  }
}

export { adminDebug }
