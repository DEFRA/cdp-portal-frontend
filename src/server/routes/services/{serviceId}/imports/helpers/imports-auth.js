import { scopes } from '@defra/cdp-validation-kit'
import { betaTesterScope } from '#server/common/constants/scopes.js'

// Admins, or beta testers who own the service: rule sets pass if any one matches, '+' marks a required scope
export function importsAuth() {
  return {
    mode: 'required',
    access: [
      { scope: [scopes.admin] },
      { scope: [`+${betaTesterScope}`, `+${scopes.serviceOwner}`] }
    ]
  }
}
