import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { getPlayground } from '../../../../PlaygroundService.js'
import createDashboardRows from '../../../../utils/createDashboardRows.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin] // TODO: open to owners
    }
  }
}

export default async function (request, h) {
  const { entity } = request.app
  const { uid } = request.params

  const playground = await getPlayground(entity.name)

  if (playground.status === 'LOADING') {
    return h.redirect(`/services/${entity.name}/diagnostics/dev#dashboards`)
  }

  return {
    entity,
    dashboardRows: createDashboardRows(
      playground.dashboards.filter((dashboard) => dashboard.uid === uid)
    )
  }
}
