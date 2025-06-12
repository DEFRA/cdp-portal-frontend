import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import {
  renderServiceTag,
  serviceTags
} from '~/src/server/admin/tags/helpers/service-tags.js'
import { transformEntityToRow } from '~/src/server/admin/tags/transformers/transform-entity-to-tag-row.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'

export const editTagController = {
  handler: async (request, h) => {
    const tag = serviceTags[request.params.tag]
    const renderedTag = renderServiceTag(tag)

    const entities = await fetchEntities()
    const rows = entities
      .filter((e) => e.tags.includes(tag?.name))
      .map((e) => transformEntityToRow(e, tag))

    const entitiesWithoutTag = buildOptions(
      entities
        .filter((e) => !e.tags.includes(tag.name))
        .map((e) => {
          return { text: e.name, value: e.name }
        }),
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
          value: { text: tag.description }
        }
      ]
    }

    return h.view('admin/tags/views/edit-tag', {
      pageTitle: `Edit Tag ${tag.name}`,
      tableData: {
        headers: [
          { id: 'service', text: 'Service', width: '3' },
          { id: 'tags', text: 'Tags', width: '5' },
          { id: 'team', text: 'Team', width: '10' },
          { id: 'action', text: 'Action', width: '5' }
        ],
        rows,
        noResult: 'No tags found'
      },
      tag,
      renderedTag: renderServiceTag(tag.name),
      tagSummaryList,
      entitiesWithoutTag
    })
  }
}
