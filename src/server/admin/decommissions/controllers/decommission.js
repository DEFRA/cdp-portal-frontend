import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchDecommission } from '~/src/server/admin/decommissions/helpers/fetchers.js'
import { transformDecommissionToSummary } from '~/src/server/admin/decommissions/transformers/decommission-to-summary.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit/src/validations.js'

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
    const decommission = await fetchDecommission(request.params.repositoryName)
    const formattedValue = formatText(decommission.repositoryName)

    // TODO polling
    return h.view('admin/permissions/views/permission', {
      pageTitle: formattedValue,
      heading: formattedValue,
      summaryList: transformDecommissionToSummary(decommission),
      decommission,
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
          text: formattedValue
        }
      ]
    })
  }
}

export { decommissionController }
