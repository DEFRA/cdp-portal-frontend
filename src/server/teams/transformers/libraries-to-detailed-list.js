import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderTag } from '../../common/helpers/view/render-tag.js'
import { sortBy } from '../../common/helpers/sort/sort-by.js'

function librariesToDetailedList(libraries = []) {
  const doInclude = ['library']
  const items = libraries.sort(sortBy('id', 'asc')).map((library) => ({
    title: {
      html: buildLink({
        href: `/utilities/libraries/${library.id}`,
        text: library.id,
        newTab: false
      })
    },
    info: {
      html: library.topics
        ?.filter((topic) => doInclude.includes(topic))
        .sort()
        .map((topic) => renderTag({ text: topic }))
        .join('')
    }
  }))

  return {
    isInverse: true,
    items
  }
}

export { librariesToDetailedList }
