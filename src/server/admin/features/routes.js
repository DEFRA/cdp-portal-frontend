import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { listFeaturesController } from '~/src/server/admin/features/controllers/features-list.js'
import { toggleFeatureController } from '~/src/server/admin/features/controllers/toggle-feature.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminFeatures = {
  plugin: {
    name: 'adminFeatures',
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
            path: '/admin/features',
            ...listFeaturesController
          },
          {
            method: 'POST',
            path: '/admin/features/{featureId}/toggle/{active}',
            ...toggleFeatureController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminFeatures }
