import Boom from '@hapi/boom'
import { parseISO, subHours } from 'date-fns'

import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchRepository } from '~/src/server/common/helpers/fetch/fetch-repository.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { fetchEntityStatus } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { pluralise } from '~/src/config/nunjucks/filters/filters.js'
import startCase from 'lodash/startCase.js'
import {
  REPOSITORY,
  SERVICE,
  TEST_SUITE
} from '~/src/server/common/patterns/entities/tabs/constants.js'
import { resourceDescriptions } from '~/src/server/common/patterns/entities/status/helpers/resource-descriptions.js'

export async function entityStatusHandler(request, h, entityType) {
  const entity = request.app.entity

  if (entity == null) {
    return Boom.notFound()
  }

  const entityStatus = await fetchEntityStatus(request.params.serviceId)

  const serviceName = entityStatus.entity.name
  const userScopes = request.auth?.credentials?.scope
  const isServiceOwner = userScopes?.includes(scopes.serviceOwner)

  const repository = await fetchRepository(serviceName).catch(nullify404)

  const resources = Object.entries(entityStatus.resources).map(
    ([name, isReady]) => ({ name, isReady })
  )

  const terminalStatuses = ['Created', 'Success']

  const isTwoHoursOld = parseISO(entity.created) < subHours(Date.now(), 2)
  const takingTooLong =
    isTwoHoursOld && !terminalStatuses.includes(entity.status)

  const poll = { count: 0 }
  const shouldPoll =
    !terminalStatuses.includes(entity.status) && poll.count === 0

  // Provide a final xhr fetch after the creation process has finished
  if (entity.status === 'Created') {
    poll.count += 1
  }

  const faviconState = !terminalStatuses.includes(entity.status)
    ? 'pending'
    : 'success'

  let entityTitle
  switch (entityType) {
    case SERVICE:
      entityTitle = 'microservice'
      break
    case TEST_SUITE:
      entityTitle = 'test suite'
      break
    case REPOSITORY:
      entityTitle = entityType
      break
    default:
      throw new Error('Unknown entity type: ' + entityType)
  }

  return h.view('common/patterns/entities/status/views/creating', {
    faviconState,
    pageTitle: `${entity.status} ${serviceName} ${entityTitle}`,
    summaryList: transformServiceToSummary(repository, entity),
    resourceDescriptions: resourceDescriptions(entityType),
    entityType,
    entity,
    isServiceOwner,
    resources,
    takingTooLong,
    shouldPoll,
    breadcrumbs: [
      {
        text: `${pluralise(startCase(entityType))}`,
        href: entityType === REPOSITORY ? '' : `/${pluralise(entityType)}`
      },
      {
        text: serviceName
      }
    ]
  })
}
