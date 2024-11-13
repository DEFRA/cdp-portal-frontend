import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import {
  activateCreateServiceDisabledController,
  deactivateCreateServiceDisabledController,
  listFeaturesController
} from '~/src/server/admin/features/controllers/index.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const adminScope = authScope([`+${scopes.admin}`])

const features = {
  plugin: {
    name: 'features',
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
            method: 'POST',
            path: '/admin/features/create-service-disabled',
            ...activateCreateServiceDisabledController
          },
          {
            method: 'POST',
            path: '/admin/features/create-service-disabled/delete',
            ...deactivateCreateServiceDisabledController
          },
          {
            method: 'GET',
            path: '/admin/features',
            ...listFeaturesController
          }
        ]
          .map(adminScope)
          .map(withTracing)
      )
    }
  }
}

export { features }
