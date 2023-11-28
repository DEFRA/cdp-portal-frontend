import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/services/cdp-portal-frontend
const serviceFixture = {
  serviceName: 'cdp-portal-frontend',
  githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
  imageName: 'cdp-portal-frontend',
  teams: [
    {
      github: 'cdp-platform',
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ]
}

export { serviceFixture }
