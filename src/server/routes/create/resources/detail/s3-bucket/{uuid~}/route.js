import formEngin from '#server/plugins/form-engine/form-engine.js'
import { scopes } from '@defra/cdp-validation-kit'
import Joi from 'joi'

export function register(routePath) {
  return [
    {
      plugin: formEngin,
      options: {
        route: {
          path: routePath,
          options: {
            auth: {
              mode: 'required',
              access: {
                scope: scopes.admin
              }
            }
          }
        },
        layout: 'routes/create/resources/detail/s3-bucket/{uuid~}/layout.njk',
        async schema(request) {
          return Joi.object({
            name: Joi.string()
              .label('Team name')
              .min(3)
              .max(53)
              .regex(/^[A-Za-z0-9-]+$/)
              .required()
          })
        },
        async init() {
          return {}
        },
        actions: {}
      }
    }
  ]
}
