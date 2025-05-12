import { config } from '~/src/config/config.js'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/test-suite/cdp-portal-smoke-tests
const testSuiteFixture = {
  serviceName: 'cdp-portal-smoke-tests',
  githubUrl: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
  imageName: 'cdp-portal-smoke-tests',
  teams: [
    {
      github: 'cdp-platform',
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ]
}

const entityTestSuiteFixture = {
  name: 'jrny-test-suite-1745403279072',
  type: 'TestSuite',
  subType: 'Journey',
  primaryLanguage: null,
  created: '2025-04-23T10:14:49.589Z',
  creator: {
    id: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
    displayName: 'Non-Admin User'
  },
  teams: [
    {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ],
  status: 'Success'
}

export { testSuiteFixture, entityTestSuiteFixture }
