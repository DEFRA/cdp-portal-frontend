import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { noValue } from '~/src/server/common/constants/no-value.js'

function entitiesToDetailedList(section, entities = []) {
  const items = entities.sort(sortBy('name', 'asc')).map((entity) => ({
    title: {
      html: buildLink({
        href: `/${section}/${entity.name}`,
        text: entity.name,
        newTab: false
      })
    },
    info: {
      html: renderTag({ text: entity.subType?.toLowerCase() ?? noValue })
    }
  }))

  return {
    isInverse: true,
    items
  }
}

export { entitiesToDetailedList }
