import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'
import { fetchTemplate } from '~/src/server/utilities/helpers/fetch-template'

const appPathPrefix = appConfig.get('appPathPrefix')

const templateController = {
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
            href: `${appConfig.get('appPathPrefix')}/utilities/templates`
          },
          {
            text: 'Templates',
            href: `${appConfig.get('appPathPrefix')}/utilities/templates`
          },
          {
            text: template.id
          }
        ],
        subNavigation: [
          {
            isActive: true,
            url: `${appPathPrefix}/utilities/templates`,
            label: 'Templates'
          },
          {
            isActive: false,
            url: `${appPathPrefix}/utilities/libraries`,
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
