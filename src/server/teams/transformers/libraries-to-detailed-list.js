import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

function librariesToDetailedList(libraries = []) {
  const doInclude = ['library']
  const items = libraries.sort(sortBy('id', 'asc')).map((library) => ({
    title: {
      html: buildLink(`/utilities/libraries/${library.id}`, library.id, false)
    },
    info: {
      html: library.topics
        ?.filter((topic) => doInclude.includes(topic))
        .sort()
        .map((topic) => renderTag(topic))
        .join('')
    }
  }))

  return {
    isInverse: true,
    items
  }
}

export { librariesToDetailedList }
