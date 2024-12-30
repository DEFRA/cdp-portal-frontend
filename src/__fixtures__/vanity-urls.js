// Response from portalBackendApi/vanity-urls/cdp-portal-frontend
const vanityUrlsFixture = {
  'infra-dev': {
    vanityUrls: [
      {
        url: 'portal-test.cdp-int.defra.cloud',
        environment: 'infra-dev',
        serviceName: 'cdp-portal-frontend',
        enabled: false,
        shuttered: false
      }
    ]
  },
  management: {
    vanityUrls: [
      {
        url: 'portal.cdp-int.defra.cloud',
        environment: 'management',
        serviceName: 'cdp-portal-frontend',
        enabled: false,
        shuttered: false
      }
    ]
  },
  dev: {
    vanityUrls: [
      {
        url: 'portal-dev.cdp-int.defra.cloud',
        environment: 'dev',
        serviceName: 'cdp-portal-frontend',
        enabled: false,
        shuttered: false
      }
    ]
  },
  test: {
    vanityUrls: [
      {
        url: 'portal-test.cdp-int.defra.cloud',
        environment: 'test',
        serviceName: 'cdp-portal-frontend',
        enabled: false,
        shuttered: false
      },
      {
        url: "portal-test-other.cdp-int.defra.cloud'",
        environment: 'test',
        serviceName: 'cdp-portal-frontend',
        enabled: false,
        shuttered: false
      }
    ]
  }
}
export { vanityUrlsFixture }
