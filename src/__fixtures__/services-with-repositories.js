import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/services
// Decorated with portalBackendApi/repositories
const servicesWithRepositoriesFixture = [
  {
    serviceName: 'cdp-portal-frontend',
    githubUrl: `https://github.com/${githubOrg}`,
    imageName: 'cdp-portal-frontend',
    description:
      'The Core Delivery Platform Portal. Gain insight on microservices, deployments, running services and teams across the platform. While being able to create and control when and where you deploy microservices. Everything you need and want to know about the Platform can be found here on the Portal.',
    primaryLanguage: 'JavaScript',
    isArchived: false,
    isTemplate: false,
    isPrivate: true,
    createdAt: '2023-04-12T17:16:48Z',
    teamName: 'Platform',
    teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
    id: 'cdp-portal-frontend',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  {
    serviceName: 'cdp-self-service-ops',
    githubUrl: `https://github.com/${githubOrg}/cdp-self-service-ops`,
    imageName: 'cdp-self-service-ops',
    description:
      'Core delivery platform Self Service Ops Node.js Backend.  This Api provides automation for service creation, deployment and future mutations sent from the Core Development Portal.',
    primaryLanguage: 'JavaScript',
    isArchived: false,
    isTemplate: false,
    isPrivate: true,
    createdAt: '2023-05-12T13:33:54Z',
    teamName: 'Platform',
    teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
    id: 'cdp-self-service-ops',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      },
      {
        github: 'fisheries',
        teamId: '087d4a80-002b-48cf-a7d3-aa60b67784f0',
        name: 'Fish-and-octopus'
      }
    ]
  }
]

export { servicesWithRepositoriesFixture }
