const provideCdpRequestId = {
  method: (request) => request.headers['x-cdp-request-id'] ?? 'missing-id',
  assign: 'cdpRequestId'
}

export { provideCdpRequestId }
