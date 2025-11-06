import Boom from '@hapi/boom'
import { parseISO, subHours } from 'date-fns'
import startCase from 'lodash/startCase.js'

import { transformServiceToSummary } from '../../../../services/service/about/transformers/service-to-summary.js'
import { fetchRepository } from '../../../helpers/fetch/fetch-repository.js'
import { nullify404 } from '../../../helpers/nullify-404.js'
import { pluralise } from '../../../helpers/pluralise.js'
import { REPOSITORY } from '../tabs/constants.js'
import { resourceDescriptions } from './helpers/resource-descriptions.js'
import capitalize from 'lodash/capitalize.js'
import { entityStatuses } from '@defra/cdp-validation-kit/src/constants/entities.js'
import { statusTagClassMap } from '../../../helpers/status-tag-class-map.js'

export async function entityStatusHandler(request, h, entityKind) {
  const entity = request.app.entity

  if (entity == null) {
    return Boom.notFound()
  }

  const serviceName = entity.name
  const teamIds = entity.teams.map(({ teamId }) => teamId)
  const isServiceOwner = await request.userIsServiceOwner(teamIds)

  const repository = await fetchRepository(serviceName).catch(nullify404)

  const resources = Object.entries(entity.overallProgress.steps).map(
    ([name, isReady]) => ({ name: capitalize(name), isReady })
  )

  const repositoryIsCreated = Boolean(repository && !repository?.isArchived)
  resources.push({
    name: 'Repository',
    isReady: repositoryIsCreated
  })

  entity.status =
    entity.status === entityStatuses.created && repositoryIsCreated
      ? entityStatuses.created
      : entityStatuses.creating

  entity.statusClass = statusTagClassMap(entity.status)

  const terminalStatuses = [entityStatuses.created, 'Success']

  const isTwoHoursOld = parseISO(entity.created) < subHours(Date.now(), 2)
  const takingTooLong =
    isTwoHoursOld && !terminalStatuses.includes(entity.status)

  const poll = { count: 0 }
  const shouldPoll =
    !terminalStatuses.includes(entity.status) && poll.count === 0

  // Provide a final xhr fetch after the creation process has finished
  if (entity.status === entityStatuses.created) {
    poll.count += 1
  }

  const faviconState = !terminalStatuses.includes(entity.status)
    ? 'pending'
    : 'success'

  const entityType = entity.type

  return h.view('common/patterns/entities/status/views/creating', {
    faviconState,
    pageTitle: `${entity.status} ${serviceName} ${entityType}`,
    summaryList: transformServiceToSummary(repository, entity),
    resourceDescriptions: resourceDescriptions(entityType.toLowerCase()),
    entityKind,
    entityType,
    entity,
    isServiceOwner,
    resources,
    takingTooLong,
    shouldPoll,
    breadcrumbs: [
      {
        text: `${pluralise(startCase(entityType))}`,
        href: entityKind === REPOSITORY ? '' : `/${pluralise(entityKind)}`
      },
      {
        text: serviceName
      }
    ]
  })
}
