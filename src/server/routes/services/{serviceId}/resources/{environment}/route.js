import { formatText } from '#config/nunjucks/filters/filters.js'
import { getActiveResourceRequestsByEntity } from '#server/routes/requests/ResourceRequestsService.js'
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'
import { serviceParamsValidation } from '#server/services/helpers/schema/service-params-validation.js'
import { scopes } from '@defra/cdp-validation-kit'
import Boom from '@hapi/boom'
import { mergeResourcesAndResourceRequests } from '../domain/mergeResourcesAndResourceRequests.js'

export { ext } from '../route.js'

export const options = {
  id: 'services/{serviceId}/resources/{environment}',
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.tenant, scopes.admin]
    }
  },
  validate: {
    params: serviceParamsValidation,
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {
  const { environment } = request.params
  const { entity } = request.app
  const serviceName = entity.name

  const team = entity?.teams?.at(0)
  const teamId = team?.teamId
  const formattedEnvironment = formatText(environment)

  let [resources, resourceRequests] = await Promise.all([
    fetchResources(entity.name, environment),
    getActiveResourceRequestsByEntity([entity.name])
  ])

  if (!resources) throw new Error('Failed to load resources')

  if (resourceRequests?.length && (await request.userIsAdmin())) {
    resources = mergeResourcesAndResourceRequests(
      resources,
      resourceRequests,
      environment,
      [entity.name]
    )
  }

  const hasNoResources = !Object.entries(resources).some(
    ([_, items]) => items?.length
  )

  return {
    pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
    entity,
    teamId,
    environment,
    resources,
    hasNoResources,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: serviceName,
        href: `/services/${serviceName}`
      },
      {
        text: 'Resources',
        href: `/services/${serviceName}/resources`
      },
      {
        text: formattedEnvironment
      }
    ]
  }
}
