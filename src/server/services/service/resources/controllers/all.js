import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
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
              domain: 'cdp-portal-backend'
            },
            {
              id: 'management',
              domain: 'cdp-portal-backend'
            },
            {
              id: 'dev',
              domain: ''
            },
            {
              id: 'test',
              domain: ''
            },
            {
              id: 'ext-test',
              domain: ''
            },
            {
              id: 'perf-test',
              domain: ''
            },
            {
              id: 'prod',
              domain: ''
            }
          ]
        },
        {
          envs: [
            {
              id: 'test',
              domain: 'cdp-portal-backend-images'
            },
            {
              id: 'management',
              domain: 'cdp-portal-backend-images'
            },
            {
              id: 'dev',
              domain: ''
            },
            {
              id: 'test',
              domain: ''
            },
            {
              id: 'ext-test',
              domain: ''
            },
            {
              id: 'perf-test',
              domain: ''
            },
            {
              id: 'prod',
              domain: ''
            }
          ]
        }
      ],
      sqs_queues: [
        {
          envs: [
            {
              id: 'test',
              domain: 'message_clearance_request'
            },
            {
              id: 'management',
              domain: 'message_clearance_request'
            },
            {
              id: 'dev',
              domain: ''
            },
            {
              id: 'test',
              domain: ''
            },
            {
              id: 'ext-test',
              domain: ''
            },
            {
              id: 'perf-test',
              domain: ''
            },
            {
              id: 'prod',
              domain: ''
            }
          ]
        }
      ],
      sns_topics: [
        {
          envs: [
            {
              id: 'test',
              domain: 'decision_notification.fifo'
            },
            {
              id: 'management',
              domain: 'decision_notification.fifo'
            },
            {
              id: 'dev',
              domain: ''
            },
            {
              id: 'test',
              domain: ''
            },
            {
              id: 'ext-test',
              domain: ''
            },
            {
              id: 'perf-test',
              domain: ''
            },
            {
              id: 'prod',
              domain: ''
            }
          ]
        },
        {
          envs: [
            {
              id: 'test',
              domain: 'error_notification.fifo'
            },
            {
              id: 'management',
              domain: 'error_notification.fifo'
            },
            {
              id: 'dev',
              domain: ''
            },
            {
              id: 'test',
              domain: ''
            },
            {
              id: 'ext-test',
              domain: ''
            },
            {
              id: 'perf-test',
              domain: ''
            },
            {
              id: 'prod',
              domain: ''
            }
          ]
        }
      ],
      sql_databases: []
    }

    const supportVerticalHeadings = environments.length >= 5

    const tablesPerResourceType = Object.entries(rowsPerResourceType)
      .filter(([type, rows]) => rows.length)
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
