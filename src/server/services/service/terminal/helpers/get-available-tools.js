import { scopes } from '@defra/cdp-validation-kit'

export function getAvailableTools(entity, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)

  const tools = [{ text: 'Terminal', value: 'terminal' }]
  if (isAdmin) {
    tools.push({ text: 'Terminal (latest)', value: 'terminal_latest' })
  }

  if (hasPostgres(entity)) {
    tools.push({ text: 'Postgres Web UI', value: 'pgweb' })
    if (isAdmin) {
      tools.push({ text: 'Postgres Web UI (latest)', value: 'pgweb_latest' })
    }
  }

  return tools
}

function hasPostgres(entity) {
  return (
    Object.values(entity.environments).find((env) => env.sql_database?.arn) !==
    undefined
  )
}
