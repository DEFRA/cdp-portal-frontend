import { scopes } from '@defra/cdp-validation-kit'
import createDashboardRows from '../../../utils/createDashboardRows.js'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { getPlayground } from '../../../PlaygroundService.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
]

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

  const playground = await getPlayground(entity.name)

  return { entity, dashboardRows: createDashboardRows(playground.dashboards) }
}
