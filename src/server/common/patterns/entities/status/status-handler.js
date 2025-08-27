import Boom from '@hapi/boom'
import { parseISO, subHours } from 'date-fns'

import { transformServiceToSummary } from '../../../../services/service/about/transformers/service-to-summary.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { fetchRepository } from '../../../helpers/fetch/fetch-repository.js'
import { nullify404 } from '../../../helpers/nullify-404.js'
import { fetchEntityStatus } from '../../../helpers/fetch/fetch-entities.js'
import { pluralise } from '../../../../../config/nunjucks/filters/filters.js'
import startCase from 'lodash/startCase.js'
import { REPOSITORY, SERVICE, TEST_SUITE } from '../tabs/constants.js'
import { resourceDescriptions } from './helpers/resource-descriptions.js'

export async function entityStatusHandler(request, h, entityKind) {
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
  switch (entityKind) {
    case SERVICE:
      entityTitle = 'microservice'
      break
    case TEST_SUITE:
      entityTitle = 'test suite'
      break
    case REPOSITORY:
      entityTitle = entityKind
      break
    default:
      throw new Error('Unknown entity type: ' + entityKind)
  }

  return h.view('common/patterns/entities/status/views/creating', {
    faviconState,
    pageTitle: `${entity.status} ${serviceName} ${entityTitle}`,
    summaryList: transformServiceToSummary(repository, entity),
    resourceDescriptions: resourceDescriptions(entityKind),
    entityKind,
    entity,
    isServiceOwner,
    resources,
    takingTooLong,
    shouldPoll,
    breadcrumbs: [
      {
        text: `${pluralise(startCase(entityKind))}`,
        href: entityKind === REPOSITORY ? '' : `/${pluralise(entityKind)}`
      },
      {
        text: serviceName
      }
    ]
  })
}
