import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { entityDebugRoute } from './routes/entity-debug.js'
import { debugRoute } from './routes/debug.js'
import { deploymentDebugRoute } from './routes/deployment-debug.js'
import { entitiesDebugRoute } from './routes/entities-debug.js'
import { republishPlatformStateMessagesRoute } from './routes/republish-platform-state.js'
import { debugRedirectRoute } from './routes/debug-redirect.js'
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
            ...debugRoute
          },
          {
            method: 'POST',
            path: '/admin/debug/{endpointPath}',
            ...debugRedirectRoute
          },
          {
            method: 'GET',
            path: '/admin/debug/entities',
            ...entitiesDebugRoute
          },
          {
            method: 'GET',
            path: '/admin/debug/entities/{entityName}',
            ...entityDebugRoute
          },
          {
            method: 'GET',
            path: '/admin/debug/deployment/{deploymentId}',
            ...deploymentDebugRoute
          },
          {
            method: 'GET',
            path: '/admin/debug/republish-platform-state-messages',
            ...republishPlatformStateMessagesRoute
          }
        ].map(adminUserScope)
      )
    }
  }
}

export { adminDebug }
