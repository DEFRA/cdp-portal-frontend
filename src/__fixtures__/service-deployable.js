import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

//  Response from portalBackendApi/services/cdp-portal-frontend
const serviceDeployableFixture = {
  serviceName: 'cdp-portal-frontend',
  githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
  imageName: 'cdp-portal-frontend'
}

export { serviceDeployableFixture }
