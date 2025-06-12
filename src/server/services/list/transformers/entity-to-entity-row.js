import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'
import startCase from 'lodash/startCase.js'
import { transformTagToEntity } from '~/src/server/admin/tags/transformers/transform-tag-to-entity.js'

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
          value: startCase(status),
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
          blank: true,
          value: (entity.tags ?? [])
            .map((tag) => transformTagToEntity(tag))
            .filter(Boolean)
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
