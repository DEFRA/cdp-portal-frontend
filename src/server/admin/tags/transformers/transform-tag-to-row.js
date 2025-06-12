import { noValue } from '~/src/server/common/constants/no-value.js'
import { transformTagToEntity } from '~/src/server/admin/tags/transformers/transform-tag-to-entity.js'

export function transformTagToRow(tag) {
  return {
    cells: [
      {
        headers: 'tag',
        entity: transformTagToEntity(tag)
      },
      {
        headers: 'description',
        entity: { kind: 'text', value: tag.description ?? noValue }
      },
      {
        entity: {
          classes: 'app-button--small app-button--primary',
          kind: 'button',
          url: `/admin/tags/${tag.name}/edit`,
          value: 'Edit'
        },
        headers: 'actions'
      }
    ]
  }
}
