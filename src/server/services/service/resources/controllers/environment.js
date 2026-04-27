import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import { resourceByEnvironment } from '../transformers/resources-by-environment.js'
import Joi from 'joi'

export const environmentResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/{environment}',
    validate: {
      query: Joi.object().keys({
        debug: Joi.boolean().default(false)
      }),
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { environment } = request.params
    const { entity } = request.app
    const serviceName = entity.name
    const environmentDetails = entity.environments[environment]

    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    const hasSqlDatabase = environmentDetails?.sql_database

    const resources = {
      s3_buckets: environmentDetails.s3_buckets.map((bucket) => ({
        icon: 'aws-s3',
        name: bucket.bucket_name,
        properties: {
          arn: bucket.arn,
          domain_name: bucket.bucket_domain_name,
          versioning: bucket.versioning
        }
      })),
      sns_topics: environmentDetails.sns_topics.map((topic) => ({
        icon: 'aws-sns',
        name: topic.name,
        properties: {
          arn: topic.arn,
          fifo_topic: topic.fifo_topic,
          content_based_deduplication: topic.content_based_deduplication
        }
      })),
      sqs_queues: environmentDetails.sqs_queues.map((queue) => ({
        icon: 'aws-sqs',
        name: queue.name,
        properties: {
          arn: queue.arn,
          url: queue.url,
          fifo_queue: queue.fifo_queue,
          content_based_deduplication: queue.content_based_deduplication,
          receive_wait_time_seconds: queue.receive_wait_time_seconds,
          subscriptions: queue.subscriptions
        }
      }))
    }

    return h.view('services/service/resources/views/environment', {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
      teamId,
      environment,
      resources,
      hasSqlDatabase,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Resources',
          href: `/services/${serviceName}/resources`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}
