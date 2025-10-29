import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../common/helpers/auth/auth-scope.js'
import { entityDebugController } from './controllers/entity-debug-controller.js'
import { debugController } from './controllers/debug-controller.js'
import { deploymentDebugController } from './controllers/deployment-debug-controller.js'
import { entitiesDebugController } from './controllers/entities-debug-controller.js'
import { republishPlatformStateMessagesController } from './controllers/republish-platform-state-controller.js'
import { debugRedirectController } from './controllers/debug-redirect-controller.js'

const adminUserScope = authScope([scopes.admin])

const debug = {
  plugin: {
    name: 'debug',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/debug',
            ...debugController
          },
          {
            method: 'POST',
            path: '/debug/{endpointPath}',
            ...debugRedirectController
          },
          {
            method: 'GET',
            path: '/debug/entities',
            ...entitiesDebugController
          },
          {
            method: 'GET',
            path: '/debug/entities/{entityName}',
            ...entityDebugController
          },
          {
            method: 'GET',
            path: '/debug/deployment/{deploymentId}',
            ...deploymentDebugController
          },
          {
            method: 'GET',
            path: '/debug/republish-platform-state-messages',
            ...republishPlatformStateMessagesController
          }
        ].map(adminUserScope)
      )
    }
  }
}

export { debug }
