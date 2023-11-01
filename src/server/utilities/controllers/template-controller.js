import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { fetchTemplate } from '~/src/server/utilities/helpers/fetch-template'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'

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
        heading: startCase(template.id),
        entityDataList: transformRepositoryToEntityDataList(template),
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
        ],
        subNavigation: [
          {
            isActive: true,
            url: '/utilities/templates',
            label: 'Templates'
          },
          {
            isActive: false,
            url: '/utilities/libraries',
            label: 'Libraries'
          }
        ]
      })
    } catch (error) {
      return Boom.boomify(error)
    }
  }
}

export { templateController }
