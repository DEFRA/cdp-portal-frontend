import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/services
const serviceDeployableFixture = {
  serviceName: 'cdp-portal-frontend',
  githubUrl: `https://github.com/${githubOrg}`,
  imageName: 'cdp-portal-frontend'
}

export { serviceDeployableFixture }
