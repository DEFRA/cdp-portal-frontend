import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { fetchEntityStatus } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { transformDecommissionToSummary } from '~/src/server/admin/decommissions/transformers/decommission-to-summary.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit/src/validations.js'
import { resourceDescriptions } from '~/src/server/common/patterns/entities/status/helpers/resource-descriptions.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

const decommissionController = {
  options: {
    validate: {
      params: Joi.object({
        repositoryName: repositoryNameValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const entityStatus = await fetchEntityStatus(request.params.repositoryName)

    const entityType = entityStatus.entity.type
    const shouldPoll =
      entityStatus.entity.status !== creationStatuses.decommissioned
    const faviconState = shouldPoll ? 'pending' : 'success'

    const resources = Object.entries(entityStatus.resources).map(
      ([name, isReady]) => ({ name, isReady })
    )

    return h.view('admin/decommissions/views/decommission', {
      faviconState,
      pageTitle: `${entityStatus.entity.status} decommission ${entityStatus.entity.name}`,
      heading: entityStatus.entity.name,
      summaryList: transformDecommissionToSummary(entityStatus.entity),
      resourceDescriptions: resourceDescriptions(entityType),
      resources,
      entityType,
      entity: entityStatus.entity,
      shouldPoll,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Decommissions',
          href: '/admin/decommissions'
        },
        {
          text: entityStatus.name
        }
      ]
    })
  }
}

export { decommissionController }
