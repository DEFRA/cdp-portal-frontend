// Response from portalBackendApi/vanity-urls/cdp-portal-backend
const apiGatewaysFixture = {
  'infra-dev': {
    apiGateways: [
      {
        api: 'portal-test.cdp-int.defra.cloud',
        environment: 'infra-dev',
        serviceName: 'cdp-portal-backend',
        shuttered: false
      }
    ]
  },
  management: {
    apiGateways: [
      {
        api: 'portal.cdp-int.defra.cloud',
        environment: 'management',
        serviceName: 'cdp-portal-backend',
        shuttered: false
      }
    ]
  },
  dev: {
    apiGateways: [
      {
        api: 'portal-dev.cdp-int.defra.cloud',
        environment: 'dev',
        serviceName: 'cdp-portal-backend',
        shuttered: false
      }
    ]
  },
  test: {
    apiGateways: [
      {
        api: 'portal-test.cdp-int.defra.cloud',
        environment: 'test',
        serviceName: 'cdp-portal-backend',
        shuttered: false
      },
      {
        api: "portal-test-other.cdp-int.defra.cloud'",
        environment: 'test',
        serviceName: 'cdp-portal-backend',
        shuttered: false
      }
    ]
  }
}
export { apiGatewaysFixture }
