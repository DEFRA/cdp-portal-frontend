// Response from portalBackendApi/shuttering/cdp-portal-backend

const shutteringUrlsFixture = (serviceName) => [
  {
    environment: 'prod',
    serviceName: serviceName,
    url: 'portal.defra.gov',
    waf: 'external_public',
    internal: false,
    status: 'Active',
    lastActionedBy: null,
    lastActionedAt: null,
    delegated: true
  },
  {
    environment: 'management',
    serviceName: serviceName,
    url: 'portal.cdp-int.defra.cloud',
    waf: 'internal_public',
    internal: true,
    status: 'Active',
    lastActionedBy: null,
    lastActionedAt: null,
    delegated: true
  },
  {
    environment: 'infra-dev',
    serviceName: serviceName,
    url: 'portal-test.cdp-int.defra.cloud',
    waf: 'internal_public',
    internal: true,
    status: 'Shuttered',
    lastActionedBy: null,
    lastActionedAt: null,
    delegated: false
  }
]

export { shutteringUrlsFixture }
