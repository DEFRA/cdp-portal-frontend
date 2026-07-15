import { scopes } from '@defra/cdp-validation-kit'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { getPlayground } from '../../../PlaygroundService.js'
import createAlertRows from '../../../utils/createAlertRows.js'

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

export default async function (request) {
  const { entity } = request.app

  const playground = await getPlayground(entity.name)

  return { entity, alertRows: createAlertRows(playground.alerts) }
}
