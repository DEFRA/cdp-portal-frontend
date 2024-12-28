import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function librariesToDetailedList(libraries = []) {
  const doNotInclude = ['cdp', 'service', 'template', 'repository']
  const items = libraries.map((library) => ({
    title: {
      html: buildLink(`/utilities/libraries/${library.id}`, library.id, false)
    },
    info: {
      html: library.topics
        ?.filter((topic) => !doNotInclude.includes(topic))
        .sort()
        .map((topic) => renderTag(topic))
        .join('')
    }
  }))

  return {
    items
  }
}

export { librariesToDetailedList }
