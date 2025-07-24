import { noValue } from '../../../../../common/constants/no-value.js'
import { formatText } from '../../../../../../config/nunjucks/filters/filters.js'
import { buildLink } from '../../../../../common/helpers/view/build-link.js'
import { renderTag } from '../../../../../common/helpers/view/render-tag.js'

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
          html: renderTag({
            text: formatText(deployedService.status),
            classes: [deployedService.statusClassname]
          })
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
