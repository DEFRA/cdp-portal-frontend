import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { transformEntityToRow } from '~/src/server/admin/tags/transformers/transform-entity-to-tag-row.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { serviceTagValues } from '~/src/server/admin/tags/helpers/schema/tag-validation.js'
import {
  renderServiceTag,
  serviceTags
} from '~/src/server/admin/tags/helpers/service-tags.js'

const tagController = {
  options: {
    validate: {
      params: Joi.object({
        tag: serviceTagValues
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const tag = serviceTags[request.params.tag]
    const renderedTag = renderServiceTag(tag)

    const entities = await fetchEntities()
    const rows = entities
      .filter((entity) => entity.tags?.includes(tag?.name))
      .map((entity) => transformEntityToRow(entity, tag))

    const entitiesWithoutTag = buildOptions(
      entities
        .filter((entity) => !entity.tags?.includes(tag?.name))
        .map((entity) => ({ text: entity.name, value: entity.name })),
      true
    )

    const tagSummaryList = {
      classes: 'app-summary-list',
      rows: [
        {
          key: { text: 'Name' },
          value: { html: renderedTag }
        },
        {
          key: { text: 'Description' },
          value: { text: tag?.description }
        }
      ]
    }

    return h.view('admin/tags/views/tag', {
      pageTitle: `Edit Tag ${tag?.name}`,
      tableData: {
        headers: [
          { id: 'service', text: 'Service', width: '20' },
          { id: 'tags', text: 'Tags', width: '20' },
          { id: 'team', text: 'Team', width: '30' },
          { id: 'action', text: 'Action', width: '30' }
        ],
        rows,
        noResult: 'No tags found'
      },
      tag,
      renderedTag: renderServiceTag(tag?.name),
      tagSummaryList,
      entitiesWithoutTag,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Tags',
          href: '/admin/tags'
        },
        {
          text: tag?.displayName,
          href: `/admin/tags/${tag?.name}`
        }
      ]
    })
  }
}

export { tagController }
