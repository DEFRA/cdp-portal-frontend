import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import createDashboardRows from '../../../../utils/createDashboardRows.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { promoteDashboard } from '../../../../PlaygroundService.js'

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

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev`)
  }

  return {
    entity,
    dashboardRows: createDashboardRows(
      playground.dashboards.filter((dashboard) => dashboard.uid === uid)
    )
  }
}

export async function POST(request, h) {
  const { entity } = request.app
  const { uid } = request.params

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev`)
  }

  try {
    await promoteDashboard(request, entity.name, uid)

    request.yar.flash(sessionNames.notifications, {
      text: 'Dashboard promoted',
      type: 'success'
    })
  } catch (error) {
    request.logger.error(error, `Failed to promote dashboard ${uid}:`)

    request.yar.flash(
      sessionNames.globalValidationFailures,
      'Failed to promote dashboard: ' +
        (error?.data?.payload?.message ??
          error?.output?.payload?.message ??
          error)
    )
  }

  return h.redirect(`/services/${entity.name}/diagnostics/dev`)
}
