import { noValue } from '~/src/server/common/constants/no-value.js'
import { transformTagToEntity } from '~/src/server/admin/tags/transformers/transform-tag-to-entity.js'

export function transformTagToRow(tag) {
  return {
    cells: [
      {
        headers: 'name',
        entity: {
          kind: 'link',
          url: `/admin/tags/${tag.name}`,
          value: tag.name
        }
      },
      {
        headers: 'tag',
        entity: transformTagToEntity(tag)
      },
      {
        headers: 'description',
        entity: { kind: 'text', value: tag.description ?? noValue }
      }
    ]
  }
}
