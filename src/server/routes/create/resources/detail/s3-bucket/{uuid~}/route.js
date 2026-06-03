import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { fetchServices } from '#server/common/helpers/fetch/fetch-entities.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { sortByName } from '#server/common/helpers/sort/sort-by-name.js'
import formEngin from '#server/plugins/form-engine/form-engine.js'
import { scopes, repositoryNameValidation } from '@defra/cdp-validation-kit'
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
          const environments = getEnvironments(request.auth.credentials?.scope)

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

            environments: Joi.array()
              .label('Environments')
              .single()
              .items(
                ...environments.map((env) =>
                  Joi.string().valid(env).label(formatText(env))
                )
              )
              .min(1)
              .required()
          })
        },
        async init() {
          return {
            environments: getEnvironments(scopes.tenant)
          }
        },
        async actions() {
          return {
            submit: {
              text: 'Add',
              async method(request, h, sanitisedFormValues) {
                console.log(sanitisedFormValues)
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
