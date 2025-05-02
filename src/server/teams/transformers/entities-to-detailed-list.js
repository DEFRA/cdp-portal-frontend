import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

function entitiesToDetailedList(section, entities = []) {
  const items = entities.sort(sortBy('name', 'asc')).map((entity) => ({
    title: {
      html: buildLink(`/${section}/${entity.name}`, entity.name, false)
    },
    info: {
      html: renderTag(entity.subType?.toLowerCase())
    }
  }))

  return {
    isInverse: true,
    items
  }
}

export { entitiesToDetailedList }
