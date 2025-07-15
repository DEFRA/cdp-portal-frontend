import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { isFeatureToggleActiveForPath } from '~/src/server/admin/features/helpers/fetch-feature-toggles.js'

export async function checkFeatureToggle(request, h) {
  if (await isFeatureToggleActiveForPath(request.path)) {
    return h
      .view('admin/features/views/disabled', {
        pageTitle: 'Feature is unavailable'
      })
      .code(statusCodes.serviceUnavailable)
      .takeover()
  }

  return h.continue
}
