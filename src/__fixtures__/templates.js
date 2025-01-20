// Response from portalBackendApi/templates
const templatesFixture = {
  message: 'success',
  repositories: [
    {
      id: 'cdp-dotnet-backend-template',
      description:
        'C# ASP.NET Minimial API template with MongoDB, FluentValidation, Swagger and Serilog logging',
      primaryLanguage: 'C#',
      url: 'https://github.com/DEFRA/cdp-dotnet-backend-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2023-08-24T07:08:56+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ],
      topics: ['backend', 'cdp', 'dotnet', 'template']
    },
    {
      id: 'cdp-node-backend-template',
      description: 'Core delivery platform Node.js Backend Template',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-node-backend-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2023-06-20T12:10:50+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'template', 'backend', 'node']
    },
    {
      id: 'cdp-node-frontend-template',
      description: 'Core delivery platform Node.js Frontend Template',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-node-frontend-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2023-04-26T15:27:09+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'frontend', 'node', 'template']
    },
    {
      id: 'cdp-node-journey-test-suite-template',
      description: 'Git repository for cdp-node-env-test-suite-template',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-node-journey-test-suite-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2024-01-24T14:49:52+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'template', 'test-suite', 'journey']
    },
    {
      id: 'cdp-perf-test-suite-template',
      description: 'Git repository for cdp-perf-test-suite-template',
      primaryLanguage: 'Shell',
      url: 'https://github.com/DEFRA/cdp-perf-test-suite-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2024-04-17T12:10:51+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'repository', 'template', 'test-suite', 'performance']
    }
  ]
}

export { templatesFixture }
