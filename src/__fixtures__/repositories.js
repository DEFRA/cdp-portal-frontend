// Response from portalBackendApi/repositories
const repositoriesFixture = {
  message: 'success',
  repositories: [
    {
      id: 'cdp-portal-backend',
      description: 'Git repository for service cdp-portal-backend',
      primaryLanguage: 'C#',
      url: `https://github.com/DEFRA/cdp-portal-backend`,
      isArchived: false,
      isTemplate: false,
      isPrivate: true,
      createdAt: '2023-08-21T11:12:06+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ]
    },
    {
      id: 'cdp-portal-frontend',
      description:
        'The Core Delivery Platform Portal. A Node.js frontend application built with Hapi.js. Helping Defra teams to create, deploy, run and monitor applications on the Core Delivery Platform.',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/DEFRA/cdp-portal-frontend`,
      isArchived: false,
      isTemplate: false,
      isPrivate: true,
      createdAt: '2023-04-12T17:16:48+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ]
    }
  ]
}

export { repositoriesFixture }
