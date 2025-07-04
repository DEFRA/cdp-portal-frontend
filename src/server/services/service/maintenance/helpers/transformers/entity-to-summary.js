import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

function entityToSummary({
  entity,
  deployedService,
  environment,
  authedUser,
  isFrontend
}) {
  const serviceUrl = `https://${deployedService.service}.${deployedService.environment}.cdp-int.defra.cloud`

  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Service name' },
        value: {
          html: buildLink({
            href: `/services/${entity.name}`,
            text: entity.name,
            newTab: false
          })
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: formatText(environment) }
      },
      {
        key: { text: 'Status' },
        value: {
          html: renderTag(formatText(deployedService.status), [
            deployedService.statusClassname
          ])
        }
      },
      {
        key: { text: 'Version' },
        value: {
          html: deployedService.version
            ? buildLink({
                href: `https://github.com/DEFRA/${deployedService.service}/releases/tag/${deployedService.version}`,
                text: deployedService.version
              })
            : noValue
        }
      },
      {
        key: { text: 'CDP Service URL' },
        value: {
          html: isFrontend ? buildLink({ href: serviceUrl }) : serviceUrl
        }
      },
      {
        key: { text: 'Requested By' },
        value: { text: authedUser?.displayName ?? noValue }
      }
    ]
  }
}

export { entityToSummary }
