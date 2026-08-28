import { scopes } from '@defra/cdp-validation-kit'
import { config } from '#config/config.js'

export function getAvailableTools(entity, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)
  const hasPostgres =
    Object.values(entity.environments).some((env) => env.sql_database?.arn) &&
    config.get('enablePgWeb')

  const tools = [{ text: 'Terminal', value: 'terminal' }]
  if (isAdmin) {
    tools.push({ text: 'Terminal (latest)', value: 'terminal_latest' })
  }

  if (hasPostgres) {
    tools.push({ text: 'Postgres Web UI', value: 'pgweb' })
    if (isAdmin) {
      tools.push({ text: 'Postgres Web UI (latest)', value: 'pgweb_latest' })
    }
  }

  return tools
}
