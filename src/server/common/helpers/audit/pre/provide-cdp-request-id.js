const provideCdpRequestId = {
  method: (request) =>
    request.headers['x-cdp-request-id'] ?? 'cdp-request-id-header-not-set',
  assign: 'cdpRequestId'
}

export { provideCdpRequestId }
