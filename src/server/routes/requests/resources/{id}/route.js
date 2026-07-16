import { scopes } from '@defra/cdp-validation-kit'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin, scopes.tenant]
    }
  }
}

export default function () {
  return {}
}
