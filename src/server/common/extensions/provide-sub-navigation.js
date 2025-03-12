import upperFirst from 'lodash/upperFirst.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

function provideSubNavForServiceOrTestSuite(subTitle, serviceOrTestSuite) {
  return function provideSubNavigation(request, h) {
    const response = request.response

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      const serviceId = response.source?.context?.service?.imageName
      const environments = getEnvironments(request.auth.credentials?.scope)

      response.source.context.subNavigation = [
        {
          isActive:
            request.path === `/${serviceOrTestSuite}s/${serviceId}/${subTitle}`,
          url: request.routeLookup(
            `${serviceOrTestSuite}s/{serviceId}/${subTitle}`,
            {
              params: { serviceId }
            }
          ),
          label: {
            text: 'All'
          }
        },
        ...environments.map((environment) => ({
          isActive: request.path.startsWith(
            `/${serviceOrTestSuite}s/${serviceId}/${subTitle}/${environment}`
          ),
          url: request.routeLookup(
            `${serviceOrTestSuite}s/{serviceId}/${subTitle}/{environment}`,
            {
              params: {
                serviceId,
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
}

export { provideSubNavForServiceOrTestSuite }
