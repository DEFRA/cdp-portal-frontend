// Response from portalBackendApi/vanity-urls/cdp-portal-backend
const apiGatewaysFixture = (serviceName = 'cdp-portal-backend') => ({
  'infra-dev': {
    apiGateways: [
      {
        api: 'portal-test.cdp-int.defra.cloud',
        environment: 'infra-dev',
        serviceName,
        shuttered: false
      }
    ]
  },
  management: {
    apiGateways: [
      {
        api: 'portal.cdp-int.defra.cloud',
        environment: 'management',
        serviceName,
        shuttered: false
      }
    ]
  },
  dev: {
    apiGateways: [
      {
        api: 'portal-dev.cdp-int.defra.cloud',
        environment: 'dev',
        serviceName,
        shuttered: false
      }
    ]
  },
  test: {
    apiGateways: [
      {
        api: 'portal-test.cdp-int.defra.cloud',
        environment: 'test',
        serviceName,
        shuttered: false
      },
      {
        api: 'portal-test-other.cdp-int.defra.cloud',
        environment: 'test',
        serviceName,
        shuttered: false
      }
    ]
  }
})

export { apiGatewaysFixture }
