import { commonTestSuiteExtensions } from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import { TEST_SUITE } from '#server/common/patterns/entities/tabs/constants.js'
import { entityStatusController } from '#server/common/patterns/entities/status/controller.js'

const controller = entityStatusController(TEST_SUITE)

export const ext = [
  ...commonTestSuiteExtensions,
  {
    type: 'onPostHandler',
    method: provideFormContextValues(),
    options: {
      before: ['yar'],
      sandbox: 'plugin'
    }
  }
]

export const options = controller.options

export async function GET(request, h) {
  return controller.handler(request, h)
}
