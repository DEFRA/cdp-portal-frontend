import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import Joi from 'joi'

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
                scope: [scopes.tenant, scopes.admin]
              }
            }
          }
        },

        ext: [...commonServiceExtensions, provideNotFoundIfPrototypeExtension],

        layout:
          'routes/services/{serviceId}/diagnostics/dev/alerts/promote/layout.njk',

        async schema(request) {
          return Joi.object({
            alerts: Joi.array()
              .label('Alerts')
              .items(Joi.string().required())
              .valid('one', 'two')
              .default([])
          })
        },

        async load(request) {
          return undefined
        },

        async actions(request) {
          const uuid = request.params.uuid

          return {
            submit: {
              text: 'Promote',
              classes: 'app-button',
              async method(request, h) {}
            },
            cancel: {
              text: 'Cancel',
              url: '/create/resources/detail'
            }
          }
        }
      }
    }
  ]
}

// export default async function (request) {
//   const { entity } = request.app

//   // TODO: Fetch
//   const playground = {
//     alerts: [
//       {
//         name: 'btms-gateway-health-status',
//         type: 'custom',
//         uid: 'e9821b3c84ffdfc70d30319ed096a0343f5aecf0',
//         annotations: {
//           description: 'BTMS Gateway service health check',
//           runbook_url:
//             'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
//           summary:
//             "BTMS Gateway health check of the application and it's dependencies."
//         }
//       }
//     ],
//     dashboards: [
//       {
//         url: 'https://metrics.prod.cdp-int.defra.cloud/d/btms-gateway-all-3da12fe2/btms-gateway-all',
//         type: 'custom',
//         uid: 'btms-gateway-all-3da12fe2',
//         scope: '',
//         version: 1
//       }
//     ]
//   }

//   return { entity, alertRows: createAlertRows(playground.alerts, 'dev', true) }
// }
