import { buildLink } from '~/src/server/common/helpers/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function teamServicesToDetailedList(services = []) {
  const doNotInclude = ['cdp', 'service']
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

export { teamServicesToDetailedList }
