import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import Joi from 'joi'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getPlayground } from '../../../PlaygroundService.js'

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
          const { entity } = request.app

          const playground = await getPlayground(entity.name)

          const alerts = playground.alerts.map(({ name }) => name)

          return Joi.object({
            alerts: Joi.array()
              .label('Alerts')
              .items(Joi.string().required())
              .valid(...alerts)
              .min(1)
              .required()
              .meta({
                component: 'checkboxGroupField',
                suggestions: buildOptions(alerts, false)
              })
              .messages({ 'any.required': 'Please select at least one alert' })
          })
        },

        async actions(request) {
          const { entity } = request.app

          return {
            submit: {
              text: 'Promote',
              classes: 'app-button',
              async method(request, h, sanitisedFormValues) {
                // TODO: call BE

                return h.redirect(
                  `/services/${entity.name}/diagnostics/dev#alerts`
                )
              }
            },
            cancel: {
              text: 'Cancel',
              url: `/services/${entity.name}/diagnostics/dev#alerts`
            }
          }
        }
      }
    }
  ]
}
