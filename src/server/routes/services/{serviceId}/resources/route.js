import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'
import Boom from '@hapi/boom'
import Joi from 'joi'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { scopes } from '@defra/cdp-validation-kit'
import { getActiveResourceRequestsByEntity } from '#server/routes/requests/ResourceRequestsService.js'
import { mergeResourcesAndResourceRequests } from './domain/mergeResourcesAndResourceRequests.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('resources', SERVICE),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  id: 'services/{serviceId}/resources',
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.tenant, scopes.admin]
    }
  },
  validate: {
    params: Joi.object({
      serviceId: Joi.string().required()
    }),
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {
  const { entity } = request.app
  const serviceName = entity.name

  const environments = getEnvironments(request.auth.credentials?.scope)

  const [resourcesPerEnv, resourceRequests] = await Promise.all([
    fetchResources(entity.name),
    getActiveResourceRequestsByEntity([entity.name])
  ])
  if (!resourcesPerEnv) throw new Error('Failed to load resources')

  if (resourceRequests?.length && (await request.userIsAdmin())) {
    Object.keys(resourcesPerEnv).forEach((env) => {
      resourcesPerEnv[env] = mergeResourcesAndResourceRequests(
        resourcesPerEnv[env],
        resourceRequests,
        env,
        [entity.name]
      )
    })
  }

  const rowsPerResourceType = transformResourcesToRows(
    environments,
    resourcesPerEnv
  )

  const hasBuckets = rowsPerResourceType.s3_buckets?.length

  const supportVerticalHeadings = environments.length >= 5

  const tablesPerResourceType = transformResourceRowsToTablesPerType(
    rowsPerResourceType,
    environments,
    supportVerticalHeadings
  )

  return {
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
        }))
      }))
    ])
  )

  return rowsPerResourceType
}

function transformResourceRowsToTablesPerType(
  rowsPerResourceType,
  environments,
  supportVerticalHeadings
) {
  return Object.fromEntries(
    Object.entries(rowsPerResourceType)
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
  )
}
