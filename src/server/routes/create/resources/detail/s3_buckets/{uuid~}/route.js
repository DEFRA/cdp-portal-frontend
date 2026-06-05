import { formatText } from '#config/nunjucks/filters/filters.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { fetchServices } from '#server/common/helpers/fetch/fetch-entities.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { sortByName } from '#server/common/helpers/sort/sort-by-name.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import { scopes, repositoryNameValidation } from '@defra/cdp-validation-kit'
import Joi from 'joi'
import { randomUUID } from 'node:crypto'
import handleNoBasket from '../../ext/handleNoBasket.js'
import provideLayoutContext from '../../ext/provideLayoutContext.js'

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
                scope: scopes.admin // TODO: Open to tenants
              }
            }
          }
        },

        ext: [handleNoBasket, provideLayoutContext('s3_bucket')],

        layout: 'routes/create/resources/detail/layouts/resource.njk',

        async schema(request) {
          const environments = getEnvironments(request.auth.credentials?.scope)
          const tenantEnvironments = getEnvironments(scopes.tenant)

          const entities = await fetchServices()
          const entityNames =
            entities
              .map((e) => e.name)
              .toSorted(sortByName)
              .map((entityName) => ({ value: entityName, text: entityName })) ??
            []
          const entityOptions = buildOptions(entityNames)

          return Joi.object({
            service: repositoryNameValidation
              .label('Owning service')
              .description('Select the microservice to add the bucket to')
              .meta({
                component: 'autocompleteField',
                suggestions: entityOptions
              }),

            name: Joi.string()
              .label('Bucket name')
              .description(
                'A prefix and suffix will automatically be added to the bucket name. See <a href="/documentation/how-to/buckets.md#bucket-naming">Bucket Naming documentation</a>'
              )
              .min(3)
              .max(63)
              .regex(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)
              .required(),

            versioning: Joi.string()
              .label('Versioning')
              .description(
                'Disabled by default on CDP to prevent unnecessary cost. See <a href="/documentation/how-to/buckets.md#bucket-versioning">Bucket Versioning documentation</a>'
              )
              .meta({
                component: 'radioGroupField'
              })
              .valid('enabled', 'disabled')
              .default('disabled')
              .optional(),

            environments: Joi.array()
              .label('Environments')
              .description('(Admin only)')
              .single()
              .items(
                ...environments.map((env) =>
                  Joi.string().valid(env).label(formatText(env))
                )
              )
              .min(1)
              .default(tenantEnvironments)
              .required()
          })
        },

        async load(request) {
          const uuid = request.params.uuid

          if (!uuid) return undefined

          const basket = request.yar.get(sessionNames.resourcesBasket)
          return basket.s3_buckets[uuid]
        },

        async actions(request, h) {
          const uuid = request.params.uuid

          return {
            submit: {
              text: uuid ? 'Update' : 'Add',
              async method(request, h, sanitisedFormValues) {
                const basket = request.yar.get(sessionNames.resourcesBasket)

                request.yar.set(sessionNames.resourcesBasket, {
                  ...basket,
                  s3_buckets: {
                    ...basket?.s3_buckets,
                    [uuid ?? randomUUID()]: sanitisedFormValues
                  }
                })
                await request.yar.commit(h)

                return h.redirect('/create/resources/detail/')
              }
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
