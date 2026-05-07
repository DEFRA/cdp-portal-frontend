import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { provideEntityExtension } from '#server/common/helpers/ext/extensions.js'

export const ext = [provideEntityExtension]

export const options = {
  id: 'services/{serviceId}/diagnostics'
}

export default async function (request, h) {
  const entity = request.app.entity
  const serviceId = entity?.name
  const environments = getEnvironments(
    request.auth.credentials?.scope,
    entity?.subType
  )

  return h.redirect(
    request.routeLookup('services/{serviceId}/diagnostics/{environment}', {
      params: {
        serviceId,
        environment: environments.at(0)
      },
      query: request.query
    })
  )
}
