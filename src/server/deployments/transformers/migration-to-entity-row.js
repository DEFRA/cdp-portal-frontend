import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user.js'
import { provideStatusClassname } from '~/src/server/deployments/helpers/provide-status-classname.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function buildDescription(migration) {
  const tooltipText = `Database Update: ${migration.version} - ${formatText(migration.status)}`

  return `<a class="app-link app-entity-table__row-header" href="/deployments/database-updates/${migration.environment.toLowerCase()}/${migration.cdpMigrationId}" data-testid="app-link">${migration.service}</a>
         <div class="app-!-layout-centered govuk-!-margin-top-1">
            ${renderComponent('tool-tip', { text: tooltipText }, [
              renderIcon('database-icon', {
                classes: 'app-icon--small govuk-!-margin-right-1'
              })
            ])}
            <div class="app-entity-table__row-caption">Database Update</div>
         </div>`
}

function migrationToEntityRow(isAuthenticated) {
  return (migration) => {
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
          [renderIcon('star-icon', { classes: 'app-icon--tiny' })]
        )
      : ''

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                isCentered: true,
                classes: 'app-entity-table__cell--owned',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
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
}

export { migrationToEntityRow }
