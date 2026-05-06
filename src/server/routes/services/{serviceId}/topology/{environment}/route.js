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

  const topology = await fetchTopology(entity.name, environment)

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
    servicesPerTeam,
    environment,
    nodeKey,
    linkKey
  }
}
