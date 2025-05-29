import Boom from '@hapi/boom'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { fetchEntityStatus } from '~/src/server/common/helpers/fetch/fetch-entities.js'

async function creatingHandler(request, h) {
  const entity = request.app.entity

  if (entity === null) {
    return Boom.notFound()
  }

  const entityStatus = await fetchEntityStatus(request.params.serviceId)

  const serviceName = entityStatus.entity.name
  const userScopes = request.auth?.credentials?.scope
  const isServiceOwner = userScopes?.includes(scopes.serviceOwner)

  const repository = await fetchRepository(serviceName).catch(nullify404)

  const isFrontend = entity.subType === 'Frontend'
  const isBackend = entity.subType === 'Backend'
  const description = repository?.description

  const resources = Object.entries(entityStatus.resources).map(
    ([name, isReady]) => ({
      name,
      isReady,
      statusClassname: isReady ? 'item-detail--green' : 'item-detail--red'
    })
  )

  const service = {
    serviceName,
    isBackend,
    isFrontend,
    description
  }

  return h.view('services/service/creating/creating', {
    pageTitle: `${serviceName} microservice`,
    summaryList: transformServiceToSummary(repository, entity),
    service,
    isServiceOwner,
    resources,
    shouldPoll: entity.status !== 'Created',
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: serviceName
      }
    ]
  })
}

export { creatingHandler }
