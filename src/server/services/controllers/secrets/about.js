import { scopes } from '~/src/server/common/constants/scopes'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'

const secretsAboutController = {
  options: {
    id: 'services/{serviceId}/secrets',
    pre: [provideService],
    ext: {
      onCredentials: addServiceOwnerScope()
    },
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.serviceOwner]
      }
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const serviceId = service?.imageName
    const servicesTeams = service?.teams ?? []
    const environments = Object.values(getEnvironmentsByTeam(servicesTeams))
    const environment = environments.at(0)

    return h.redirect(
      request.routeLookup('services/{serviceId}/secrets/{environment}', {
        params: { serviceId, environment }
      })
    )
  }
}

export { secretsAboutController }
