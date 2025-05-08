import upperFirst from 'lodash/upperFirst.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

function provideSubNavForServiceOrTestSuite(subTitle, serviceOrTestSuite) {
  return function provideSubNavigation(request, h) {
    const response = request.response

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      const serviceId = request.app.entity?.name
      const environments = getEnvironments(request.auth.credentials?.scope)

      response.source.context.subNavigation = [
        {
          isActive:
            request.path ===
            `/${pluralise(serviceOrTestSuite)}/${serviceId}/${subTitle}`,
          url: request.routeLookup(
            `${pluralise(serviceOrTestSuite)}/{serviceId}/${subTitle}`,
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
            `/${pluralise(serviceOrTestSuite)}/${serviceId}/${subTitle}/${environment}`
          ),
          url: request.routeLookup(
            `${pluralise(serviceOrTestSuite)}/{serviceId}/${subTitle}/{environment}`,
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
