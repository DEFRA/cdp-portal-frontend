import Joi from 'joi'
import Boom from '@hapi/boom'

import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { fetchResources } from '../../../helpers/fetch/fetch-resources.js'
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

    const rowsPerResourceType = transformResourcesToRows(
      environments,
      resourcesPerEnv
    )

    const hasBuckets = rowsPerResourceType.s3_buckets?.length

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
      hasBuckets,
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

function transformResourcesToRows(environments, resourcesPerEnv) {
  const allResourcesByType = Object.entries(resourcesPerEnv).reduce(
    (acc, [_, types]) => {
      for (const [type, resources] of Object.entries(types)) {
        for (const { name } of resources) {
          acc[type] = acc[type] ?? new Set()
          acc[type].add(name)
        }
      }
      return acc
    },
    {}
  )

  const rowsPerResourceType = Object.fromEntries(
    Object.entries(allResourcesByType).map(([type, names]) => [
      type,
      [...names].map((name) => ({
        envs: environments.map((env) => ({
          id: env,
          resource: resourcesPerEnv?.[env]?.[type]?.find(
            (resource) => resource.name === name
          )
            ? name
            : ''
        }))
      }))
    ])
  )

  return rowsPerResourceType
}
