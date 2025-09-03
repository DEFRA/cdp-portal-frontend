import { statusCodes } from '@defra/cdp-validation-kit'

import { isFeatureToggleActiveForPath } from './fetch-feature-toggles.js'

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
