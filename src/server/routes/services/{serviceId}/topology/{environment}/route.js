import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { fetchTopology } from '#server/services/helpers/fetch/fetch-topology.js'
import { serviceParamsValidation } from '#server/services/helpers/schema/service-params-validation.js'
import { scopes } from '@defra/cdp-validation-kit'
import { Boom } from '@hapi/boom'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('topology', SERVICE, { withoutAll: true }),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  id: 'services/{serviceId}/topology/{environment}',
  validate: {
    params: serviceParamsValidation,
    failAction: () => Boom.boomify(Boom.notFound())
  },
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.tenant, */ scopes.admin] // TODO: Enable for tenants
    }
  }
}

export default async function (request) {
  const { entity } = request.app
  const environment = request.params.environment

  //  const topology = await fetchTopology(entity.name, environment)

  const topology = [
    {
      name: 'cdp-portal-backend',
      type: 4,
      teams: [
        {
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      resources: [
        {
          name: 'cdp_platform_portal_events',
          icon: 'aws-sns',
          links: []
        },
        {
          name: 'ecr_image_push',
          icon: 'aws-sns',
          links: []
        },
        {
          name: 'cdp_platform_portal_events',
          icon: 'aws-sqs',
          links: [
            {
              service: 'cdp-portal-backend',
              resource: 'cdp_platform_portal_events',
              type: 'subscription'
            }
          ]
        },
        {
          name: 'cdp_workflow_events',
          icon: 'aws-sqs',
          links: []
        },
        {
          name: 'ecr_image_push',
          icon: 'aws-sqs',
          links: [
            {
              service: 'cdp-portal-backend',
              resource: 'ecr_image_push',
              type: 'subscription'
            }
          ]
        },
        {
          name: 'ecs_deployments',
          icon: 'aws-sqs',
          links: [
            {
              service: null,
              resource: 'ecs_deployments',
              type: 'subscription'
            }
          ]
        }
      ]
    }
  ]

  const servicesPerTeam = Object.groupBy(topology, ({ teams }) =>
    teams.map(({ teamId }) => teamId).join('_')
  )

  return {
    topology,
    servicesPerTeam,
    environment,
    nodeKey: (service, resource) =>
      `${[service.name, resource?.name, resource?.icon].join('_')}`,
    linkKey: (link) => `${[link.service, link?.resource].join('_')}`
  }
}
