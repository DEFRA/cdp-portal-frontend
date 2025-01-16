import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

export function provideSubContextNavigation(request, section, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const serviceId = response.source?.context?.service?.imageName
    const environments = getEnvironments(request.auth.credentials?.scope)

    response.source.context.subNavigation = [
      {
        isActive: request.path === `/services/${serviceId}/${section}`,
        url: request.routeLookup(`services/{serviceId}/${section}`, {
          params: { serviceId }
        }),
        label: {
          text: 'All'
        }
      },
      ...environments.map((environment) => ({
        isActive: request.path.startsWith(
          `/services/${serviceId}/${section}/${environment}`
        ),
        url: request.routeLookup(
          `services/{serviceId}/${section}/{environment}`,
          {
            params: {
              serviceId,
              environment
            }
          }
        ),
        label: { text: formatText(environment) }
      }))
    ]
  }

  return h.continue
}
