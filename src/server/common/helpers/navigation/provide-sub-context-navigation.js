import upperFirst from 'lodash/upperFirst.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

export function provideSubContextNavigation(request, subPathContext, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const serviceId = response.source?.context?.service?.imageName
    const environments = getEnvironments(request.auth.credentials?.scope)

    response.source.context.subNavigation = [
      {
        isActive: request.path === `/services/${serviceId}/${subPathContext}`,
        url: request.routeLookup('services/{serviceId}/{subPathContext}', {
          params: { serviceId, subPathContext }
        }),
        label: {
          text: 'All'
        }
      },
      ...environments.map((environment) => ({
        isActive: request.path.startsWith(
          `/services/${serviceId}/${subPathContext}/${environment}`
        ),
        url: request.routeLookup(
          'services/{serviceId}/{subPathContext}/{environment}',
          {
            params: {
              serviceId,
              subPathContext,
              environment
            }
          }
        ),
        label: { text: upperFirst(environment) }
      }))
    ]
  }

  return h.continue
}
