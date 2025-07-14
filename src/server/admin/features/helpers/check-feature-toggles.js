import { statusCodes } from '~/src/server/common/constants/status-codes.js'

export async function checkFeatureToggles(request, h) {
  if (await request.featureToggles.isEnabled(request.path)) {
    return h
      .view('admin/features/views/disabled', {
        pageTitle: 'Feature is unavailable'
      })
      .code(statusCodes.serviceUnavailable)
      .takeover()
  }

  return h.continue
}
