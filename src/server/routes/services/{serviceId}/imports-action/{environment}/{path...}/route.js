import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import actions from './actions/index.js'
import provideLayoutContext from './ext/provideLayoutContext.js'
import { requireAdminOrBetaTester } from '../../../imports/helpers/require-admin-or-beta-tester.js'

export function register(routePath) {
  return [
    {
      plugin: formEngine,
      options: {
        route: {
          path: routePath,
          options: {
            auth: {
              mode: 'required',
              access: {
                scope: [scopes.admin, scopes.serviceOwner]
              }
            }
          }
        },

        ext: [
          ...commonServiceExtensions,
          {
            type: 'onPreHandler',
            method: requireAdminOrBetaTester,
            options: {
              sandbox: 'plugin'
            }
          },
          provideLayoutContext()
        ],

        layout:
          'routes/services/{serviceId}/imports-action/{environment}/{path...}/layout.njk',

        async schema(request) {
          const { action } = request.query

          return actions[action]?.schema(request)
        },

        async load(request) {
          const { action } = request.query

          return actions[action]?.load?.(request)
        },

        async actions(request, h) {
          const { action } = request.query

          return actions[action]?.actions(request, h)
        }
      }
    }
  ]
}
