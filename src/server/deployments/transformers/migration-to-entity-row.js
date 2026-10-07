import { formatText } from '#config/nunjucks/filters/filters.js'
import { sanitiseUser } from '../../common/helpers/sanitisation/sanitise-user.js'
import { provideStatusClassname } from '../helpers/provide-status-classname.js'
import { dirname, basename } from 'node:path'

function migrationToEntityRow(migration) {
  const isImport = migration.kind === 'import'
  return {
    isOwner: migration.isOwner,
    service: migration.service,
    version: migration.version,
    importFolder: isImport ? dirname(migration.importPath) : null,
    importFile: isImport ? basename(migration.importPath) : null,
    environment: migration.environment,
    deploymentId: migration.cdpMigrationId,
    kind: isImport ? 'import' : 'update',
    kindText: isImport ? 'Import' : 'Update',
    kindClass: 'govuk-tag--blue',
    statusText: formatText(migration.status),
    statusClass: provideStatusClassname(migration.status),
    teams: migration.teams,
    by: sanitiseUser(migration.user?.displayName),
    started: migration.created
  }
}

export { migrationToEntityRow }
