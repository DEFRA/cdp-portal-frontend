import { scopes } from '@defra/cdp-validation-kit'
import { betaTesterScope } from '#server/common/constants/scopes.js'

export function userIsAdminOrBetaTester(userScopes = []) {
  return (
    userScopes.includes(scopes.admin) || userScopes.includes(betaTesterScope)
  )
}
