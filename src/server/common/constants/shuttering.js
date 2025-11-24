/**
 * @type {{shuttered: string, active: string, pendingShuttered: string, pendingActive: string}}
 */
const shutteringStatus = {
  shuttered: 'Shuttered',
  active: 'Active',
  pendingShuttered: 'PendingShuttered',
  pendingActive: 'PendingActive'
}

const shutteringUrlType = {
  frontendVanityUrl: 'frontend_vanity_url',
  apiGatewayUrl: 'apigw_vanity_url'
}

export { shutteringStatus, shutteringUrlType }
