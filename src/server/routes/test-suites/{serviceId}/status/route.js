import { TEST_SUITE } from '#server/common/patterns/entities/tabs/constants.js'
import { entityStatusController } from '#server/common/patterns/entities/status/controller.js'
import * as parent from '../route.js'

const controller = entityStatusController(TEST_SUITE)

export const ext = parent.ext

export const options = controller.options

export async function GET(request, h) {
  return controller.handler(request, h)
}
