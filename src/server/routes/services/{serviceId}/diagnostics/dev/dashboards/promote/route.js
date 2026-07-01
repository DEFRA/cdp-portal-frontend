import { scopes } from '@defra/cdp-validation-kit'
import createDashboardRows from '../../../utils/createDashboardRows.js'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.tenant, scopes.admin]
    }
  }
}

export default async function (request) {
  const { entity } = request.app

  return { entity, createDashboardRows }
}
