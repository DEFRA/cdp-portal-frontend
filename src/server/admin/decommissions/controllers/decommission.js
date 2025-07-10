import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'
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
    const entity = await fetchEntity(request.params.repositoryName)

    const entityType = entity.type
    const shouldPoll = entity.status !== creationStatuses.decommissioned
    const faviconState = shouldPoll ? 'pending' : 'success'

    return h.view('admin/decommissions/views/decommission', {
      faviconState,
      pageTitle: `${entity.status} decommission ${entity.name}`,
      heading: entity.name,
      summaryList: transformDecommissionToSummary(entity),
      resourceDescriptions: resourceDescriptions(entityType),
      entityType,
      entity,
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
          text: entity.name
        }
      ]
    })
  }
}

export { decommissionController }
