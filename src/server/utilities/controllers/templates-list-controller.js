import { config } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchTemplates } from '~/src/server/common/helpers/fetch-templates'
import { transformUtilityToEntityRow } from '~/src/server/utilities/transformers/transform-utility-to-entity-row'

const appPathPrefix = config.get('appPathPrefix')

const templatesListController = {
  handler: async (request, h) => {
    const { templates } = await fetchTemplates()

    const entityRows = templates
      ?.sort(sortBy('id', 'asc'))
      ?.map(transformUtilityToEntityRow('templates'))

    return h.view('utilities/views/list', {
      pageTitle: 'Templates',
      heading: 'Templates',
      entityRows,
      subNavigation: [
        {
          isActive:
            request?.path === `${appPathPrefix}/utilities/templates` ?? false,
          url: '/utilities/templates',
          label: 'Templates'
        },
        {
          isActive:
            request?.path === `${appPathPrefix}/utilities/libraries` ?? false,
          url: '/utilities/libraries',
          label: 'Libraries'
        }
      ],
      headingCaption:
        'Templates are cloned and used for creating new platform services.',
      noResult: 'Currently there are no templates'
    })
  }
}

export { templatesListController }
