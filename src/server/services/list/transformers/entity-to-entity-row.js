import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { serviceTags } from '~/src/server/admin/tags/helpers/service-tags.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function entityToEntityRow(entity) {
  const status = entity.status

  const teams = entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  const githubUrl = `https://github.com/DEFRA/${entity.name}`

  // For services that are being created show in-progress or failure tag. For created services show created date
  const isCreatedSuccessfully = status === 'Success' || status === 'Created'
  const createdEntity = isCreatedSuccessfully
    ? {
        headers: 'created',
        entity: { kind: 'date', value: entity.created }
      }
    : {
        headers: 'created',
        entity: {
          kind: 'tag',
          value: formatText(status),
          classes: statusTagClassMap(status)
        }
      }

  const icon = entity.isOwner
    ? renderComponent(
        'tool-tip',
        { text: 'Owned Service', classes: 'app-tool-tip--small' },
        [renderIcon('star-icon', { classes: 'app-icon--minuscule' })]
      )
    : ''

  const tags =
    entity.tags?.map((tagName) => serviceTags[tagName]).filter(Boolean) ?? []

  return {
    cells: [
      {
        headers: 'owner',
        isCentered: true,
        classes: 'app-entity-table__cell--owned',
        entity: { kind: 'html', value: icon }
      },
      {
        headers: 'service',
        entity: {
          kind: 'link',
          value: entity.name,
          url: `/services/${entity.name}`
        }
      },
      {
        headers: 'tags',
        entity: {
          kind: 'group',
          value: tags.map((tag) => ({
            kind: 'tag',
            value: tag.displayName,
            classes: tag.className
          }))
        }
      },
      {
        headers: 'team',
        entity: { kind: 'list', value: teams }
      },
      {
        headers: 'kind',
        entity: entity.subType
          ? {
              kind: 'tag',
              classes: 'govuk-tag--blue',
              value: entity.subType
            }
          : { kind: 'text', value: noValue }
      },
      {
        headers: 'github-url',
        entity: {
          kind: 'link',
          value: githubUrl,
          url: githubUrl
        }
      },
      createdEntity
    ]
  }
}

export { entityToEntityRow }
