import { kebabCase, upperFirst } from 'lodash'

import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'

async function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const imageName = response.source?.context?.service?.imageName
    const servicesTeams = response.source?.context?.service?.teams ?? []
    const environments = Object.values(getEnvironmentsByTeam(servicesTeams))
    const secretsEnvironments = environments.map((environment) => ({
      isActive:
        request.path === `/services/${imageName}/secrets/${environment}`,
      url: request.routeLookup('services/{serviceId}/secrets/{environment}', {
        params: {
          serviceId: imageName,
          environment
        }
      }),
      label: upperFirst(kebabCase(environment))
    }))

    response.source.context.subNavigation = [
      {
        isActive: request.path === `/services/${imageName}/secrets`,
        url: request.routeLookup('services/{serviceId}/secrets', {
          params: { serviceId: imageName }
        }),
        label: 'Intro'
      },
      ...secretsEnvironments
    ]
  }

  return h.continue
}

export { provideSubNavigation }
