import { sessionNames } from '#server/common/constants/session-names.js'
import { fetchServiceNames } from '#server/common/helpers/fetch/fetch-entities.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { sortByName } from '#server/common/helpers/sort/sort-by-name.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'
import Joi from 'joi'
import handleNoBasket from '../../ext/handleNoBasket.js'
import provideLayoutContext from '../../ext/provideLayoutContext.js'
import createEnvironmentOptions from '../../domain/create-environment-options.js'
import {
  Resources,
  getBasketResource,
  updateBasketResource
} from '../../domain/basket.js'
import { options as parentOptions } from '../../route.js'

export function register(routePath) {
  return [
    {
      plugin: formEngine,
      options: {
        route: {
          path: routePath,
          options: {
            auth: parentOptions.auth
          }
        },

        ext: [handleNoBasket, provideLayoutContext('sns_topics')],

        layout: 'routes/create/resources/detail/layouts/resource.njk',

        async schema(request) {
          const userSession = request.auth.credentials

          const serviceNames = await fetchServiceNames(userSession)
          const entityNames =
            serviceNames
              .toSorted(sortByName)
              .map((entityName) => ({ value: entityName, text: entityName })) ??
            []
          const entityOptions = buildOptions(entityNames)

          return Joi.object({
            service: repositoryNameValidation
              .label('Owning service')
              .description('Select the microservice to add the topic to')
              .valid(...serviceNames)
              .messages({ 'any.only': 'Select a service' })
              .meta({
                component: 'autocompleteField',
                suggestions: entityOptions
              }),

            name: Joi.string()
              .label('Topic name')
              .description(
                'When requesting a FIFO topic <strong>.fifo</strong> will automatically be suffixed to the name. See <a href="documentation/how-to/sqs-sns.md#types-of-sns-topics-and-sqs-queues-supported-by-the-cdp-platform">SQS/SNS Type documentation</a>'
              )
              .min(3)
              .max(75)
              .regex(/^[a-z0-9][a-z0-9-_]+[a-z0-9]$/)
              .required(),

            fifo: Joi.boolean()
              .label('Fifo topic')
              .description(
                'See <a href="documentation/how-to/sqs-sns.md#types-of-sns-topics-and-sqs-queues-supported-by-the-cdp-platform">SQS/SNS Type documentation</a>'
              )
              .default(false)
              .required(),

            contentDeduplication: Joi.boolean()
              .label('Content deduplication (FIFO only)')
              .default(false)
              .required(),

            environments: Joi.string()
              .label('Environments')
              .description('(Admin only)')
              .valid(...createEnvironmentOptions.map(({ value }) => value))
              .meta({
                component: 'selectField',
                suggestions: createEnvironmentOptions
              })
              .default('tenants')
              .required()
          })
        },

        async load(request) {
          const uuid = request.params.uuid

          if (!uuid) return undefined

          const basket = request.yar.get(sessionNames.resourcesBasket)
          return getBasketResource(basket, Resources.snsTopics, uuid)
        },

        async actions(request) {
          const uuid = request.params.uuid

          return {
            submit: {
              text: uuid ? 'Update' : 'Add',
              async method(request, h, sanitisedFormValues) {
                const basket = request.yar.get(sessionNames.resourcesBasket)

                request.yar.set(
                  sessionNames.resourcesBasket,
                  updateBasketResource(
                    basket,
                    Resources.snsTopics,
                    uuid,
                    sanitisedFormValues
                  )
                )

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
