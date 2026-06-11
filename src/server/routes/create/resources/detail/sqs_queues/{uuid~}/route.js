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

        ext: [handleNoBasket, provideLayoutContext('sqs_queues')],

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

          const options = {
            messageRetention: Joi.number()
              .label('Message retention')
              .default(14)
              .min(0)
              .max(14)
              .required()
              .meta({ suffix: 'days', classes: 'govuk-input--width-10' }),

            visibilityTimeout: Joi.number()
              .label('Visibility Timeout')
              .default(60)
              .min(0)
              .max(43200)
              .required()
              .meta({ suffix: 'seconds', classes: 'govuk-input--width-10' }),

            receiveWaitTime: Joi.number()
              .label('Receive wait time')
              .default(20)
              .min(0)
              .max(20)
              .required()
              .meta({ suffix: 'seconds', classes: 'govuk-input--width-10' }),

            contentDeduplication: Joi.boolean()
              .label('Content based deduplication')
              .default(false)
              .required()
          }

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
              .label('Queue name')
              .description(
                'When requesting a FIFO queue <strong>.fifo</strong> will automatically be suffixed to the name. See <a href="documentation/how-to/sqs-sns.md#types-of-sns-topics-and-sqs-queues-supported-by-the-cdp-platform">SQS/SNS Type documentation</a>'
              )
              .min(3)
              .max(75)
              .regex(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)
              .required(),

            fifo: Joi.boolean()
              .label('Fifo topic')
              .description(
                'See <a href="documentation/how-to/sqs-sns.md#types-of-sns-topics-and-sqs-queues-supported-by-the-cdp-platform">SQS/SNS Type documentation</a>'
              )
              .falsy('false')
              .truthy('true')
              .default(false)
              .required(),

            queueOptions: Joi.object(options).label('Queue options').required(),

            deadLetterQueueOptions: Joi.object({
              ...options,
              maxReceiveCount: Joi.number()
                .label('Max Receive Count')
                .default(3)
                .min(1)
                .max(10)
                .required()
                .meta({ classes: 'govuk-input--width-10' })
            })
              .label('Dead letter queue options')
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
          return getBasketResource(basket, Resources.sqsQueues, uuid)
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
                    Resources.sqsQueues,
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
