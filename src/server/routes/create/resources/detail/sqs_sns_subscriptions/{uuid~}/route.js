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
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'
import {
  Resources,
  getBasketResource,
  getBasketResourceList,
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

        ext: [handleNoBasket, provideLayoutContext('sqs_sns_subscriptions')],

        layout: 'routes/create/resources/detail/layouts/resource.njk',

        async schema(request, h, formValues) {
          const userSession = request.auth.credentials

          const serviceNames = await fetchServiceNames(userSession)
          const entityNames =
            serviceNames
              .toSorted(sortByName)
              .map((entityName) => ({ value: entityName, text: entityName })) ??
            []
          const entityOptions = buildOptions(entityNames)

          const queueService = normalize(formValues.queueService)
          const topicService = normalize(formValues.topicService)
          const basket = request.yar.get(sessionNames.resourcesBasket)

          const queueNames = queueService
            ? await getQueues(queueService, basket)
            : []
          const queueOptions = buildOptions(queueNames)

          const topicNames = topicService
            ? await getTopics(topicService, basket)
            : []
          const topicOptions = buildOptions(topicNames)

          return Joi.object({
            queueService: repositoryNameValidation
              .label('Queue service')
              .description('Select the microservice which owns the SQS queue')
              .valid(...serviceNames)
              .messages({ 'any.only': 'Select a service' })
              .meta({
                component: 'autocompleteField',
                suggestions: entityOptions,
                dataJs: 'auto-refresh'
              }),

            queue: Joi.string()
              .label('Queue name')
              .min(3)
              .max(75)
              .regex(/^[a-z0-9][a-z0-9-_]+[a-z0-9]$/)
              .required()
              .valid(...queueNames)
              .messages({ 'any.only': 'Select a service' })
              .meta({
                component: 'selectField',
                suggestions: queueOptions,
                dataXhr: 'queue'
              }),

            topicService: repositoryNameValidation
              .label('Topic service')
              .description('Select the microservice which owns the SNS topic')
              .valid(...serviceNames)
              .messages({ 'any.only': 'Select a service' })
              .meta({
                component: 'autocompleteField',
                suggestions: entityOptions,
                dataJs: 'auto-refresh'
              }),

            topic: Joi.string()
              .label('Topic name')
              .min(3)
              .max(75)
              .regex(/^[a-z0-9][a-z0-9-_]+[a-z0-9]$/)
              .required()
              .valid(...topicNames)
              .messages({ 'any.only': 'Select a service' })
              .meta({
                component: 'selectField',
                suggestions: topicOptions
              }),

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
          return getBasketResource(basket, Resources.sqsSnsSubscriptions, uuid)
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
                    Resources.sqsSnsSubscriptions,
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

async function getQueues(serviceName, basket) {
  const resources = (await fetchResources(serviceName)) ?? {}
  const existingQueues = [
    ...new Set(
      Object.entries(resources)
        .map(([_, config]) =>
          config?.sqs_queues?.map((resource) => resource.name)
        )
        .flat()
    )
  ]

  const inBasketQueues =
    getBasketResourceList(basket, Resources.sqsQueues)
      .filter(({ service }) => service === serviceName)
      .map(({ name }) => name) ?? []

  return [...existingQueues, ...inBasketQueues].sort(sortByName)
}

async function getTopics(serviceName, basket) {
  const resources = (await fetchResources(serviceName)) ?? {}
  const existingTopics = [
    ...new Set(
      Object.entries(resources)
        .map(([_, config]) =>
          config?.sns_topics?.map((resource) => resource.name)
        )
        .flat()
    )
  ]

  const inBasketTopics =
    getBasketResourceList(basket, Resources.snsTopics)
      .filter(({ service }) => service === serviceName)
      .map(({ name }) => name) ?? []

  return [...existingTopics, ...inBasketTopics].sort(sortByName)
}

function normalize(fieldValue) {
  if (Array.isArray(fieldValue)) return fieldValue.at(0)
  return fieldValue
}
