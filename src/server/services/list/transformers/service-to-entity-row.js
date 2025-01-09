import { config } from '~/src/config/config.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function serviceToEntityRow(isAuthenticated) {
  return (service) => {
    const githubOrg = config.get('githubOrg')
    const status = service?.serviceStatus?.status
    const hasStatus = Boolean(status)
    const kind = service.topics?.includes('frontend')
      ? 'Frontend'
      : service.topics?.includes('backend')
        ? 'Backend'
        : false

    const teams = service?.teams
      ?.filter((team) => team.teamId)
      ?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))

    // For services that are being created show, in-progress or failure tag. For created services show created date
    const createdEntity = hasStatus
      ? {
          headers: 'created',
          entity: {
            kind: 'tag',
            value: formatText(status),
            classes: statusTagClassMap(status)
          }
        }
      : {
          headers: 'created',
          entity: { kind: 'date', value: service.createdAt }
        }

    const icon = service.userOwnsService
      ? renderComponent(
          'tool-tip',
          { text: 'Owned Service', classes: 'app-tool-tip--small' },
          [renderIcon('star-icon', { classes: 'app-icon--tiny' })]
        )
      : ''

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
        {
          headers: 'service',
          entity: {
            kind: 'link',
            value: service.serviceName,
            url: hasStatus
              ? `/services/create-status/${service.serviceName}`
              : `/services/${service.serviceName}`
          }
        },
        {
          headers: 'team',
          entity: { kind: 'group', value: teams }
        },
        {
          headers: 'kind',
          entity: kind
            ? {
                kind: 'tag',
                classes: 'govuk-tag--blue',
                value: kind
              }
            : { kind: 'text', value: noValue }
        },
        {
          headers: 'Language',
          entity: { kind: 'text', value: service.primaryLanguage }
        },
        {
          headers: 'GitHub Repository',
          entity: {
            kind: 'link',
            value: `${githubOrg}/${service.id}`,
            url: `https://github.com/${githubOrg}/${service.id}`,
            newWindow: true
          }
        },
        createdEntity
      ]
    }
  }
}

export { serviceToEntityRow }
