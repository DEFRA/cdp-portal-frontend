import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import createAlertRows from '../../../utils/createAlertRows.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { promoteAlerts } from '../../../PlaygroundService.js'

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
    return h.redirect(`/services/${entity.name}/diagnostics/dev#alerts`)
  }

  return { entity, alertRows: createAlertRows(playground.alerts) }
}

export async function POST(request, h) {
  const { entity } = request.app

  const playground = request.yar.get(sessionNames.grafanaPlayground)

  if (!playground) {
    return h.redirect(`/services/${entity.name}/diagnostics/dev#alerts`)
  }

  // TODO: error handling
  await promoteAlerts(request, entity.name)

  return h.redirect(`/services/${entity.name}/diagnostics/dev#alerts`)
}
