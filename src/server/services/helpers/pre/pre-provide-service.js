/**
 * Service made available via the onPreAuth ext - provideService
 */
const preProvideService = {
  method: function preProvideService(request) {
    return request.app.service ?? null
  },
  assign: 'service'
}

export { preProvideService }
