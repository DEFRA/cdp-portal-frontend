import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { listFeaturesController } from './controllers/features-list.js'
import { toggleFeatureController } from './controllers/toggle-feature.js'

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
