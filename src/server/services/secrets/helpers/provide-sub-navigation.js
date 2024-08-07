import { kebabCase, upperFirst } from 'lodash'

import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'

async function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const serviceId = response.source?.context?.service?.imageName
    const servicesTeams = response.source?.context?.service?.teams ?? []
    const environments = Object.values(getEnvironmentsByTeam(servicesTeams))

    response.source.context.subNavigation = [
      {
        isActive: request.path === `/services/${serviceId}/secrets`,
        url: request.routeLookup('services/{serviceId}/secrets', {
          params: { serviceId }
        }),
        label: {
          text: 'All'
        }
      },
      ...environments.map((environment) => ({
        isActive: request.path.startsWith(
          `/services/${serviceId}/secrets/${environment}`
        ),
        url: request.routeLookup('services/{serviceId}/secrets/{environment}', {
          params: {
            serviceId,
            environment
          }
        }),
        label: { text: upperFirst(kebabCase(environment)) }
      }))
    ]
  }

  return h.continue
}

export { provideSubNavigation }
