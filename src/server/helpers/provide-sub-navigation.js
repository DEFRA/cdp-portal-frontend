import upperFirst from 'lodash/upperFirst.js'
import { getEnvironments } from '../common/helpers/environments/get-environments.js'
import { pluralise } from '../common/helpers/pluralise.js'

function provideSubNav(subTitle, entityType) {
  return function provideSubNavigation(request, h) {
    const response = request.response

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      const entity = request.app.entity
      const serviceId = entity?.name
      const environments = getEnvironments(
        request.auth.credentials?.scope,
        entity?.type
      )

      response.source.context.subNavigation = [
        {
          isActive:
            request.path ===
            `/${pluralise(entityType)}/${serviceId}/${subTitle}`,
          url: request.routeLookup(
            `${pluralise(entityType)}/{serviceId}/${subTitle}`,
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
            `/${pluralise(entityType)}/${serviceId}/${subTitle}/${environment}`
          ),
          url: request.routeLookup(
            `${pluralise(entityType)}/{serviceId}/${subTitle}/{environment}`,
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

export { provideSubNav }
