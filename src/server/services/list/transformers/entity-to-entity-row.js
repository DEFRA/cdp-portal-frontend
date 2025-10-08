import { formatText } from '../../../../config/nunjucks/filters/filters.js'
import { statusTagClassMap } from '../../../common/helpers/status-tag-class-map.js'
import { serviceTags } from '../../../admin/tags/helpers/service-tags.js'
import { renderTag } from '../../../common/helpers/view/render-tag.js'
import {
  renderComponent,
  renderIcon
} from '../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../common/constants/no-value.js'

function buildServiceDescription(entity) {
  const tagsHtml =
    entity.tags
      ?.map((tagName) => {
        const tagDetail = serviceTags[tagName]

        return renderTag({
          text: tagDetail.displayName,
          classes: tagDetail.className
        })
      })
      .filter(Boolean) ?? []

  const tagsMarkup = `<div class="app-!-layout-centered govuk-!-margin-top-2">
                        <div class="app-entity-table__row-caption">${tagsHtml.join(' ')}</div>
                      </div>`

  return `<a class="app-link app-entity-table__row-header" href="/services/${entity.name}" data-testid="app-link">${entity.name}</a>
          ${tagsHtml.length > 0 ? tagsMarkup : ''}`
}

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
        {
          text: 'Owned Service',
          classes: 'app-tool-tip--small'
        },
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
        html: buildServiceDescription(entity)
      },
      {
        headers: 'team',
        entity: { kind: 'list', value: teams }
      },
      {
        headers: 'type',
        html: renderTag({
          text: entity.subType ?? entity.type ?? noValue,
          classes: 'govuk-tag--blue'
        })
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
