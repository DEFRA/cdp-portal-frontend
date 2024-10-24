import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation'
import {
  activateCreateServiceDisabledController,
  deactivateCreateServiceDisabledController,
  listFeaturesController
} from '~/src/server/admin/features/controllers'
import { scopes } from '~/src/server/common/constants/scopes'

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
        ].map(adminScope)
      )
    }
  }
}

export { features }
