import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

function templatesToDetailedList(templates = []) {
  const doInclude = ['journey', 'performance', 'dotnet', 'node']
  const items = templates.sort(sortBy('id', 'asc')).map((template) => ({
    title: {
      html: buildLink({
        href: `/utilities/templates/${template.id}`,
        text: template.id,
        newTab: false
      })
    },
    info: {
      html: template.topics
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

export { templatesToDetailedList }
