const provideCdpRequestId = {
  method: (request) =>
    request.headers['x-cdp-request-id'] ?? 'cdp-request-id-not-found',
  assign: 'cdpRequestId'
}

export { provideCdpRequestId }
