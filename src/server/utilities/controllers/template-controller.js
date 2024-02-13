import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTemplate } from '~/src/server/utilities/helpers/fetch/fetch-template'
import { repositoryToEntityDataList } from '~/src/server/utilities/transformers/repository-to-entity-data-list'

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
    try {
      const { template } = await fetchTemplate(request.params?.templateId)

      return h.view('utilities/views/template', {
        pageTitle: template.id,
        heading: template.id,
        entityDataList: repositoryToEntityDataList(template),
        template,
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
            text: template.id
          }
        ]
      })
    } catch (error) {
      return Boom.boomify(error)
    }
  }
}

export { templateController }
