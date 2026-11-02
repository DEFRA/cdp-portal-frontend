import { formatText } from '#config/nunjucks/filters/filters.js'
import { sanitiseUser } from '../../common/helpers/sanitisation/sanitise-user.js'
import { provideStatusClassname } from '../helpers/provide-status-classname.js'
import { buildLink } from '#server/common/helpers/view/build-link.js'
import { renderIcon } from '#config/nunjucks/globals/globals.js'
import { noValue } from '#server/common/constants/no-value.js'

function migrationToEntityRow(migration) {
  const { environment, cdpMigrationId, version, migrationKind } = migration

  const versionRow =
    migrationKind === 'import'
      ? {
          html: `
            <div style="display: flex; align-items: center; justify-content: flex-start;">
              ${renderIcon('database-icon', { classes: 'app-icon--small govuk-!-margin-right-1' })} ${noValue}
            </div>
          `
        }
      : {
          html: `
            <div style="display: flex; align-items: center; justify-content: flex-start;">
              ${renderIcon('database-icon', { classes: 'app-icon--small govuk-!-margin-right-1' })} ${buildLink(
                {
                  href: `/deployments/database-updates/${environment}/${cdpMigrationId}`,
                  text: version
                }
              )}
            </div>
          `
        }
  return {
    isOwner: migration.isOwner,
    service: migration.service,
    version,
    versionRow,
    migrationKind: migration.migrationKind,
    environment,
    deploymentId: cdpMigrationId,
    kind: 'update',
    kindText: 'Update',
    kindClass: 'govuk-tag--blue',
    statusText: formatText(migration.status),
    statusClass: provideStatusClassname(migration.status),
    teams: migration.teams,
    by: sanitiseUser(migration.user?.displayName),
    started: migration.created
  }
}

export { migrationToEntityRow }
