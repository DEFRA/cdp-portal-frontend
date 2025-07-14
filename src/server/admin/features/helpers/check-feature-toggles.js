export async function checkFeatureToggles(request, h) {
  if (await request.featureToggles.isEnabled(request.path)) {
    return h
      .view('admin/features/views/disabled', {
        pageTitle: 'Feature is unavailable'
      })
      .code(503)
      .takeover()
  }

  return h.continue
}
