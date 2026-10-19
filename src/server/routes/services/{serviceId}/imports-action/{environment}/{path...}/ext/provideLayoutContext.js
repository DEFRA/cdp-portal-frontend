import { getRawPath } from '#server/common/helpers/url/url-helpers.js'
import actions from '../actions/index.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import Boom from '@hapi/boom'

export default function provideLayoutContext() {
  return {
    type: 'onPostHandler',
    method: (request, h) => {
      if (request.response.variety !== 'view') {
        return h.continue
      }
      const response = request.response
      response.source.context = response.source.context
        ? response.source.context
        : {}

      const { action, target } = request.query
      const { path = '', environment } = request.params
      const entity = request.app.entity
      const isFolder = getRawPath(request).endsWith('/')
      const userSession = request.auth.credentials

      const environments = getEnvironments(userSession?.scope, entity?.subType)

      if (!environments.includes(environment)) {
        return Boom.notFound('Invalid environment')
      }

      response.source.context.environment = environment

      response.source.context.actionTitle =
        actions[action]?.title(request) ?? ''
      response.source.context.actionDescription =
        actions[action]?.description(request) ?? ''

      response.source.context.pageTitle = `Import - ${response.source.context.actionTitle}`

      if (action === 'import') {
        response.source.context.importStep = target ? 2 : 1
      }

      const relativePathParts = path.split('/').filter((seg) => seg !== '')

      response.source.context.breadcrumbs = [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: entity.name,
          href: `/services/${entity.name}`
        },
        {
          text: 'Imports',
          href: `/services/${entity.name}/imports`
        },
        {
          text: formatText(environment),
          href:
            path !== ''
              ? `/services/${entity.name}/imports/${environment}`
              : undefined
        },
        ...relativePathParts.map((part, index) => {
          const partPath = relativePathParts.slice(0, index + 1).join('/')

          if (!isFolder && index === relativePathParts.length - 1) {
            return {
              text: part
            }
          }

          return {
            text: part,
            href: `/services/${entity.name}/imports/${partPath}/`
          }
        }),
        {
          text: response.source.context.actionTitle
        }
      ]

      return h.continue
    },
    options: { sandbox: 'plugin' }
  }
}
