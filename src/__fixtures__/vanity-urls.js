// Response from portalBackendApi/vanity-urls/cdp-portal-frontend
const vanityUrlsFixture = {
  'infra-dev': {
    vanityUrls: ['https://portal-test.cdp-int.defra.cloud']
  },
  management: {
    vanityUrls: ['https://portal.cdp-int.defra.cloud']
  },
  dev: {
    vanityUrls: ['https://portal-dev.cdp-int.defra.cloud']
  },
  test: {
    vanityUrls: [
      'https://portal-test.cdp-int.defra.cloud',
      'https://portal-test-other.cdp-int.defra.cloud'
    ]
  }
}
export { vanityUrlsFixture }
