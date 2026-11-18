import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import actions from './actions/index.js'
import provideLayoutContext from './ext/provideLayoutContext.js'
import { importsAuth } from '../../../imports/helpers/imports-auth.js'

export function register(routePath) {
  return [
    {
      plugin: formEngine,
      options: {
        route: {
          path: routePath,
          options: {
            auth: importsAuth()
          }
        },

        ext: [...commonServiceExtensions, provideLayoutContext()],

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
