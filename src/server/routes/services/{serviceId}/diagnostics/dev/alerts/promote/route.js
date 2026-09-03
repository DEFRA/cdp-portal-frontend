import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import createAlertRows from '../../../utils/createAlertRows.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { promoteAlerts } from '../../../PlaygroundService.js'
import { environments } from '#config/environments.js'

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

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev`)
  }

  return {
    entity,
    alertRows: createAlertRows(playground.alerts, environments.dev.kebabName)
  }
}

export async function POST(request, h) {
  const { entity } = request.app

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev`)
  }

  try {
    await promoteAlerts(request, entity.name)

    request.yar.flash(sessionNames.notifications, {
      text: 'Alerts promoted',
      type: 'success'
    })
  } catch (error) {
    request.logger.error(error, `Failed to promote alerts:`)

    request.yar.flash(
      sessionNames.globalValidationFailures,
      'Failed to promote alerts: ' +
        (error?.data?.payload?.message ??
          error?.output?.payload?.message ??
          error)
    )
  }

  return h.redirect(`/services/${entity.name}/diagnostics/dev`)
}
