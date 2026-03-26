import Boom from '@hapi/boom'
import { parseISO, subHours } from 'date-fns'
import startCase from 'lodash/startCase.js'

import { transformServiceToSummary } from '../../../../services/service/about/transformers/service-to-summary.js'
import { fetchRepository } from '../../../helpers/fetch/fetch-repository.js'
import { nullify404 } from '../../../helpers/nullify-404.js'
import { pluralise } from '../../../helpers/pluralise.js'
import { REPOSITORY } from '../tabs/constants.js'
import {
  entityStatuses,
  entityTypes
} from '@defra/cdp-validation-kit/src/constants/entities.js'
import { statusTagClassMap } from '../../../helpers/status-tag-class-map.js'
import { nonAdminEnvironments } from '../../../../../config/environments.js'

const stepsByEntityType = {
  [entityTypes.microservice]: [
    'infra',
    'dns',
    'nginx',
    'squid',
    'logs',
    'metrics'
  ],
  [entityTypes.testSuite]: ['infra', 'logs', 'squid']
}

function progressTable(entity) {
  const table = []

  const cols = stepsByEntityType[entity.type]
  for (const env of nonAdminEnvironments) {
    const row = { env: env.kebabName, cols: [] }

    for (const col of cols) {
      const done = entity?.progress[env.kebabName]?.steps[col]
      row.cols.push(done)
    }
    table.push(row)
  }

  return table
}

export async function entityStatusHandler(request, h, entityKind) {
  const entity = request.app.entity

  if (entity == null) {
    return Boom.notFound()
  }

  const serviceName = entity.name
  const teamIds = entity.teams.map(({ teamId }) => teamId)
  const isServiceOwner = await request.userIsServiceOwner(teamIds)

  const repository = await fetchRepository(serviceName).catch(nullify404)
  const ecrRegistry = entity.environments?.management?.ecr_repository
  const resources = [
    {
      name: 'GitHub Repository',
      isReady: Boolean(repository)
    },
    {
      name: 'Container Registry',
      isReady: Boolean(ecrRegistry)
    }
  ]

  const steps = stepsByEntityType[entity.type]
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
  const stepsTable = progressTable(entity)

  return h.view('common/patterns/entities/status/views/creating', {
    faviconState,
    pageTitle: `${entity.status} ${serviceName} ${entityType}`,
    summaryList: transformServiceToSummary(repository, entity),
    entityKind,
    entityType,
    entity,
    isServiceOwner,
    resources,
    takingTooLong,
    shouldPoll,
    steps,
    stepsTable,
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
