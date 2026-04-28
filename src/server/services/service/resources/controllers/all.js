import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'
import { formatText } from '#config/nunjucks/filters/filters.js'

export const allResourcesController = {
  options: {
    id: 'services/{serviceId}/resources',
    validate: {
      query: Joi.object().keys({
        debug: Joi.boolean().default(false)
      }),
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { entity } = request.app
    const serviceName = entity.name

    const environments = getEnvironments(request.auth.credentials?.scope)

    const resourcesPerEnv = await fetchResources(entity.name)

    const rowsPerResourceType = {
      s3_buckets: [
        {
          envs: [
            {
              id: 'test',
              resource: 'cdp-portal-backend'
            },
            {
              id: 'management',
              resource: 'cdp-portal-backend'
            },
            {
              id: 'dev',
              resource: ''
            },
            {
              id: 'test',
              resource: ''
            },
            {
              id: 'ext-test',
              resource: ''
            },
            {
              id: 'perf-test',
              resource: ''
            },
            {
              id: 'prod',
              resource: ''
            }
          ]
        },
        {
          envs: [
            {
              id: 'test',
              resource: 'cdp-portal-backend-images'
            },
            {
              id: 'management',
              resource: 'cdp-portal-backend-images'
            },
            {
              id: 'dev',
              resource: ''
            },
            {
              id: 'test',
              resource: ''
            },
            {
              id: 'ext-test',
              resource: ''
            },
            {
              id: 'perf-test',
              resource: ''
            },
            {
              id: 'prod',
              resource: ''
            }
          ]
        }
      ],
      sqs_queues: [
        {
          envs: [
            {
              id: 'test',
              resource: 'message_clearance_request'
            },
            {
              id: 'management',
              resource: 'message_clearance_request'
            },
            {
              id: 'dev',
              resource: ''
            },
            {
              id: 'test',
              resource: ''
            },
            {
              id: 'ext-test',
              resource: ''
            },
            {
              id: 'perf-test',
              resource: ''
            },
            {
              id: 'prod',
              resource: ''
            }
          ]
        }
      ],
      sns_topics: [
        {
          envs: [
            {
              id: 'test',
              resource: 'decision_notification.fifo'
            },
            {
              id: 'management',
              resource: 'decision_notification.fifo'
            },
            {
              id: 'dev',
              resource: ''
            },
            {
              id: 'test',
              resource: ''
            },
            {
              id: 'ext-test',
              resource: ''
            },
            {
              id: 'perf-test',
              resource: ''
            },
            {
              id: 'prod',
              resource: ''
            }
          ]
        },
        {
          envs: [
            {
              id: 'test',
              resource: 'error_notification.fifo'
            },
            {
              id: 'management',
              resource: 'error_notification.fifo'
            },
            {
              id: 'dev',
              resource: ''
            },
            {
              id: 'test',
              resource: ''
            },
            {
              id: 'ext-test',
              resource: ''
            },
            {
              id: 'perf-test',
              resource: ''
            },
            {
              id: 'prod',
              resource: ''
            }
          ]
        }
      ],
      sql_databases: []
    }

    const supportVerticalHeadings = environments.length >= 5

    const tablesPerResourceType = Object.entries(rowsPerResourceType)
      .filter(([_, rows]) => rows.length)
      .map(([type, rows]) => [
        type,
        {
          headers: [
            ...environments.map((env) => ({
              ...(supportVerticalHeadings && { verticalText: true }),
              id: env.toLowerCase(),
              text: formatText(env),
              width: Math.round(100 / environments.length)
            }))
          ],
          rows
        }
      ])

    return h.view('services/service/resources/views/all', {
      pageTitle: `${serviceName} - Resources`,
      entity,
      environments,
      tablesPerResourceType,
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
          text: 'Resources'
        }
      ]
    })
  }
}
