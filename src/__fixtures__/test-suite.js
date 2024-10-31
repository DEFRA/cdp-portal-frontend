import { config } from '~/src/config/index.js'

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

const testSuiteWithLastRunFixture = {
  id: 'cdp-portal-smoke-tests',
  serviceName: 'cdp-portal-smoke-tests',
  githubUrl: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
  url: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
  teams: [
    {
      github: 'cdp-platform',
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ],
  lastRun: {
    created: '2023-04-12T17:16:48Z',
    taskLastUpdated: '2023-04-12T17:18:48Z',
    testStatus: 'passed'
  },
  testType: 'Smoke'
}

export { testSuiteFixture, testSuiteWithLastRunFixture }
