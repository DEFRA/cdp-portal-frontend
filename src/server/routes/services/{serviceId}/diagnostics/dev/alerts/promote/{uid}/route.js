import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import createAlertRows from '../../../../utils/createAlertRows.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { promoteAlert } from '../../../../PlaygroundService.js'
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
  const { uid } = request.params

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev`)
  }

  return {
    entity,
    alertRows: createAlertRows(
      playground.alerts.filter((alert) => alert.uid === uid),
      environments.dev.kebabName
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
    await promoteAlert(request, entity.name, uid)

    request.yar.flash(sessionNames.notifications, {
      text: 'Alert promoted',
      type: 'success'
    })
  } catch (error) {
    request.logger.error(error, `Failed to promote alert:`)

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
