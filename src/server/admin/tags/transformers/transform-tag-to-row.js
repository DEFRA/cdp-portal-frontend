import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

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
        entity: {
          kind: 'tag',
          value: formatText(tag.displayName),
          classes: tag.className
        }
      },
      {
        headers: 'description',
        entity: { kind: 'text', value: tag.description ?? noValue }
      }
    ]
  }
}
