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
    serviceName: 'ai-backend',
    githubUrl: `https://github.com/${githubOrg}/ai-backend`,
    imageName: 'ai-backend',
    teams: [
      {
        github: 'bees',
        teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89',
        name: 'Bees'
      },
      {
        teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274',
        name: 'Trees-and-forests'
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
  },
  {
    serviceName: 'cdp-example-node-postgres-be',
    githubUrl: `https://github.com/${githubOrg}/cdp-example-node-postgres-be`,
    imageName: 'cdp-example-node-postgres-be',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  }
]

export { servicesFixture }
