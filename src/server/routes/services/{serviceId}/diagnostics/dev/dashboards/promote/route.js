import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import Joi from 'joi'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getPlayground, promoteDashboards } from '../../../PlaygroundService.js'

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
                scope: [scopes.admin] // TODO: open to owners
              }
            }
          }
        },

        ext: [...commonServiceExtensions, provideNotFoundIfPrototypeExtension],

        layout:
          'routes/services/{serviceId}/diagnostics/dev/dashboards/promote/layout.njk',

        async schema(request) {
          const { entity } = request.app

          const playground = await getPlayground(entity.name)

          const dashboards = playground.dashboards.map(({ uid }) => uid)

          return Joi.object({
            uids: Joi.array()
              .label('Dashboards')
              .items(Joi.string().required())
              .single()
              .valid(...dashboards)
              .min(1)
              .required()
              .meta({
                component: 'checkboxGroupField',
                suggestions: buildOptions(
                  playground.dashboards.map(({ uid, title, url }) => ({
                    value: uid,
                    text: title ?? url.split('/').at(-1)
                  })),
                  false
                )
              })
              .messages({
                'any.required': 'Please select at least one dashboard'
              })
          })
        },

        async actions(request) {
          const { entity } = request.app

          return {
            submit: {
              text: 'Promote',
              classes: 'app-button',
              async method(request, h, sanitisedFormValues) {
                await promoteDashboards(request, [...sanitisedFormValues.uids])

                return h.redirect(
                  `/services/${entity.name}/diagnostics/dev#dashboards`
                )
              }
            },
            cancel: {
              text: 'Cancel',
              url: `/services/${entity.name}/diagnostics/dev#dashboards`
            }
          }
        }
      }
    }
  ]
}
