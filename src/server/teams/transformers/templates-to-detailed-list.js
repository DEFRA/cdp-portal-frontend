import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function templatesToDetailedList(templates = []) {
  const doInclude = ['journey', 'performance', 'dotnet', 'node']
  const items = templates.map((template) => ({
    title: {
      html: buildLink(`/utilities/templates/${template.id}`, template.id, false)
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
