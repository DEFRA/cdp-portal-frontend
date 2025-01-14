import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function servicesToDetailedList(services = []) {
  const doInclude = ['frontend', 'backend']
  const items = services.map((service) => ({
    title: {
      html: buildLink(
        `/services/${service.serviceName}`,
        service.serviceName,
        false
      )
    },
    info: {
      html: service.topics
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

export { servicesToDetailedList }
