import Boom from '@hapi/boom'
import Joi from 'joi'

import { formatDistanceStrict, parseISO, subHours } from 'date-fns'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import { getActions } from '../helpers/actions.js'
import { creationStatuses } from '../../../common/constants/creation-statuses.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'
import { fetchRepository } from '../../../common/helpers/fetch/fetch-repository.js'
import { resourceDescriptions } from '../../../common/patterns/entities/status/helpers/resource-descriptions.js'
import { transformDecommissionToSummary } from '../transformers/decommission-to-summary.js'
import capitalize from 'lodash/capitalize.js'

const decommissionController = {
  options: {
    id: 'admin/decommissions/{repositoryName}',
    validate: {
      params: Joi.object({
        repositoryName: repositoryNameValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const repositoryName = request.params.repositoryName

    const repository = await fetchRepository(repositoryName).catch(nullify404)
    const entity = await fetchEntity(repositoryName)
    const entityType = entity.type

    const isTwoHoursOld =
      parseISO(entity.decommissioned.started) < subHours(Date.now(), 2)
    const takingTooLong =
      isTwoHoursOld && entity.status !== creationStatuses.decommissioned

    const poll = { count: 0 }
    const shouldPoll =
      entity.status !== creationStatuses.decommissioned && poll.count === 0

    // Provide a final xhr fetch after the decommissioning process has finished
    if (entity.status === creationStatuses.decommissioned) {
      poll.count += 1
    }

    const faviconState = shouldPoll ? 'pending' : 'success'
    const resources = Object.entries(entity.overallProgress.steps).map(
      ([name, isReady]) => ({ name: capitalize(name), isReady })
    )
    resources.push({
      name: 'Repository',
      isReady: !repository?.isArchived
    })

    const actionLinks = getActions()

    const durationDetail = {
      started: entity.decommissioned.started,
      finished: entity.decommissioned.finished,
      get elapsed() {
        return formatDistanceStrict(
          this.started,
          this.finished ?? new Date().toISOString(),
          { includeSeconds: true }
        )
      }
    }

    return h.view('admin/decommissions/views/decommission', {
      faviconState,
      pageTitle: `${entity.status} ${entity.name}`,
      heading: entity.name,
      summaryList: transformDecommissionToSummary(repository, entity),
      resourceDescriptions: resourceDescriptions(entityType.toLowerCase()),
      resources,
      entityType,
      entity,
      shouldPoll,
      takingTooLong,
      actionLinks,
      durationDetail,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Decommissions',
          href: '/admin/decommissions'
        },
        {
          text: entity.name
        }
      ]
    })
  }
}

export { decommissionController }
