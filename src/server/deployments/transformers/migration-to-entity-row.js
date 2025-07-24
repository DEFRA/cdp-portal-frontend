import { noValue } from '../../common/constants/no-value.js'
import { formatText } from '../../../config/nunjucks/filters/filters.js'
import { sanitiseUser } from '../../common/helpers/sanitisation/sanitise-user.js'
import { provideStatusClassname } from '../helpers/provide-status-classname.js'
import {
  renderComponent,
  renderIcon
} from '../../common/helpers/nunjucks/render-component.js'

function buildDescription(migration) {
  const tooltipText = `Database Update: ${migration.version} - ${formatText(migration.status)}`

  return `<a class="app-link app-entity-table__row-header" href="/deployments/database-updates/${migration.environment.toLowerCase()}/${migration.cdpMigrationId}" data-testid="app-link">${migration.service}</a>
         <div class="app-!-layout-centered govuk-!-margin-top-1">
            ${renderComponent('tool-tip', { text: tooltipText }, [
              renderIcon('database-icon', {
                classes: 'app-icon--tiny govuk-!-margin-right-1'
              })
            ])}
            <div class="app-entity-table__row-caption">Database update</div>
         </div>`
}

function migrationToEntityRow(migration) {
  const teams = migration?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  const icon = migration.isOwner
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
        headers: 'description',
        html: buildDescription(migration)
      },
      {
        headers: 'version',
        entity: {
          kind: 'text',
          value: migration.version ?? noValue
        }
      },
      {
        headers: 'status',
        entity: {
          kind: 'tag',
          value: formatText(migration.status),
          classes: provideStatusClassname(migration.status)
        }
      },
      {
        headers: 'kind',
        entity: {
          kind: 'tag',
          value: 'Update',
          classes: 'govuk-tag--blue'
        }
      },
      {
        headers: 'by',
        entity: {
          kind: 'text',
          value: sanitiseUser(migration.user?.displayName)
        }
      },
      {
        headers: 'team',
        entity: {
          kind: 'group',
          value: teams?.length ? teams : null
        }
      },
      {
        headers: 'started',
        entity: {
          kind: 'date',
          value: migration.created,
          withSeconds: true
        }
      }
    ]
  }
}

export { migrationToEntityRow }
