import { config } from '~/src/config/config.js'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/services
const servicesFixture = [
  {
    serviceName: 'cdp-portal-frontend',
    githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
    imageName: 'cdp-portal-frontend',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      },
      {
        github: 'core-ai',
        teamId: null,
        name: null
      }
    ]
  },
  {
    serviceName: 'cdp-user-service-backend',
    githubUrl: `https://github.com/${githubOrg}/cdp-user-service-backend`,
    imageName: 'cdp-user-service-backend',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  {
    serviceName: 'forms-designer',
    githubUrl: `https://github.com/${githubOrg}/forms-designer`,
    imageName: 'forms-designer',
    teams: [
      {
        github: 'forms',
        teamId: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca',
        name: 'Forms'
      }
    ]
  }
]

export { servicesFixture }
