import { provideService } from '~/src/server/services/helpers/provide-service.js'
import { validateServiceIsNotATestSuite } from '~/src/server/services/helpers/validate-service-is-not-a-test-suite.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideSubNavigation } from '~/src/server/services/buckets/helpers/provide-sub-navigation.js'
import { serviceTerminal } from '~/src/server/services/terminal/routes.js'
import { serviceSecrets } from '~/src/server/services/secrets/routes.js'
import { aboutService } from '~/src/server/services/about/routes.js'
import { serviceBuckets } from '~/src/server/services/buckets/routes.js'
import { serviceProxy } from '~/src/server/services/proxy/routes.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'

const serviceRoutes = {
  plugin: {
    name: 'serviceRoutes',
    register: (server) => {
      server.ext([
        {
          type: 'onPreAuth',
          method: provideService,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPreHandler',
          method: validateServiceIsNotATestSuite,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onCredentials',
          method: addServiceOwnerScope,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        ...aboutService,
        ...serviceBuckets,
        ...serviceProxy,
        ...serviceSecrets,
        ...serviceTerminal
      ])
    }
  }
}

export { serviceRoutes }
