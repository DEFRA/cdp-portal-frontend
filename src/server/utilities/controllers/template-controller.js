import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTemplates } from '~/src/server/utilities/helpers/fetch/fetch-templates.js'
import { transformRepositoryToSummary } from '~/src/server/utilities/transformers/repository-to-summary.js'

const templateController = {
  options: {
    validate: {
      params: Joi.object({
        templateId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { repository } = await fetchTemplates(request.params?.templateId)

    return h.view('utilities/views/template', {
      pageTitle: repository.id,
      summaryList: transformRepositoryToSummary(repository),
      repository,
      breadcrumbs: [
        {
          text: 'Utilities',
          href: '/utilities/templates'
        },
        {
          text: 'Templates',
          href: '/utilities/templates'
        },
        {
          text: repository.id
        }
      ]
    })
  }
}

export { templateController }
