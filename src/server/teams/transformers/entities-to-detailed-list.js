import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderTag } from '../../common/helpers/view/render-tag.js'
import { sortBy } from '../../common/helpers/sort/sort-by.js'
import { noValue } from '../../common/constants/no-value.js'

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
