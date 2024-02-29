import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/test-suite/cdp-portal-frontend
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

export { testSuiteFixture }
