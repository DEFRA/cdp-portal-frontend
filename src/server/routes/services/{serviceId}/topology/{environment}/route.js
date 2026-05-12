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
import { formatText } from '#config/nunjucks/filters/filters.js'
import { fetchRunningServices } from '#server/common/helpers/fetch/fetch-running-services.js'

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
      scope: [scopes.tenant, scopes.admin]
    }
  }
}

export default async function (request) {
  const { entity } = request.app
  const environment = request.params.environment

  const [topology, runningServices] = await Promise.all([
    fetchTopology(entity.name, environment),
    fetchRunningServices(entity.name)
  ])

  const serviceDeployedInEnvironment = runningServices.some(
    (service) => service.environment === environment
  )

  const hasCdpResourcesLinks = topology
    .flatMap((service) => service.resources)
    .flatMap((resource) => resource.links)
    .some((link) => !link.service)

  const cdpResources = hasCdpResourcesLinks && {
    name: 'AWS',
    icon: 'aws',
    teams: [
      {
        teamId: 'amazon',
        name: 'Amazon'
      }
    ]
  }

  const servicesPerTeam = Object.groupBy(
    [...topology, ...(cdpResources ? [cdpResources] : [])],
    ({ teams }) => teams.map(({ teamId }) => teamId).join('_')
  )

  const nodeKey = (service, resource) =>
    `${[service.name, resource?.type, resource?.name].filter(Boolean).join('_')}`

  const linkKey = (link) =>
    link.service
      ? `${[link.service, link.type, link.resource].filter(Boolean).join('_')}`
      : `AWS`

  return {
    topology,
    serviceDeployedInEnvironment,
    servicesPerTeam,
    environment,
    nodeKey,
    linkKey,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      {
        text: 'Topology'
      },
      {
        text: formatText(environment)
      }
    ]
  }
}
