/**
 * Service made available via the onPreAuth ext - provideService
 */
const provideService = {
  method: function provideService(request) {
    return request.app.service
  },
  assign: 'service'
}

export { provideService }
