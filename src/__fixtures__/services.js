// Response from portalBackendApi/services
const servicesFixture = [
  {
    serviceName: 'cdp-portal-frontend',
    githubUrl: `https://github.com/DEFRA/cdp-portal-frontend`,
    imageName: 'cdp-portal-frontend',
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  {
    serviceName: 'cdp-user-service-backend',
    githubUrl: `https://github.com/DEFRA/cdp-user-service-backend`,
    imageName: 'cdp-user-service-backend',
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
