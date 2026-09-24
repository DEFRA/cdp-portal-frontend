import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import actions from './actions/index.js'

export const ext = [...commonServiceExtensions]

export function register(routePath) {
  return [
    {
      plugin: formEngine,
      options: {
        route: {
          path: routePath,
          options: {
            //id: 'services/{serviceId}/imports-action',
            auth: {
              mode: 'required',
              access: {
                scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
              }
            }
          }
        },

        ext: [...commonServiceExtensions],

        layout:
          'routes/services/{serviceId}/imports-action/{path...}/layout.njk',

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

// export default async function (request) {
//   const { path = '' } = request.params
//   const entity = request.app.entity
//   const { action } = request.query

//   const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

//   return {
//     pageTitle: 'Imports Action',
//     breadcrumbs: [
//       {
//         text: 'Services',
//         href: '/services'
//       },
//       {
//         text: entity.name,
//         href: `/services/${entity.name}`
//       },
//       {
//         text: 'Imports',
//         href: path !== '' ? `/services/${entity.name}/imports` : undefined
//       },
//       ...relativePathParts.map((part, index) => {
//         const partPath = relativePathParts.slice(0, index + 1).join('/')
//         return {
//           text: part,
//           href:
//             path !== partPath
//               ? `/services/${entity.name}/imports/${partPath}/`
//               : undefined
//         }
//       })
//     ]
//   }
// }
