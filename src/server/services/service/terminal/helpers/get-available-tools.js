import { scopes } from '@defra/cdp-validation-kit'

export function getAvailableTools(entity, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)
  const hasPostgres = Object.values(entity.environments).some(
    (env) => env.sql_database?.arn
  )

  const canUsedPgWeb =
    isAdmin || userScopes.includes('team:central-animal-store')

  const tools = [{ text: 'Terminal', value: 'terminal' }]
  if (isAdmin) {
    tools.push({ text: 'Terminal (latest)', value: 'terminal_latest' })
  }

  if (canUsedPgWeb && hasPostgres) {
    tools.push({ text: 'Postgres Web UI', value: 'pgweb' })
    if (isAdmin) {
      tools.push({ text: 'Postgres Web UI (latest)', value: 'pgweb_latest' })
    }
  }

  return tools
}
