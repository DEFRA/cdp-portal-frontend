import { config } from '~/src/config/config.js'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/templates
const templatesFixture = {
  message: 'success',
  templates: [
    {
      id: 'cdp-node-frontend-template',
      description: 'Core delivery platform Node.js Frontend Template',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-node-frontend-template`,
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
      ]
    },
    {
      id: 'cdp-node-backend-template',
      description: 'Core delivery platform Node.js Backend Template',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-node-backend-template`,
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
      ]
    },
    {
      id: 'cdp-dotnet-backend-template',
      description:
        'C# ASP.NET Minimial API template with MongoDB, FluentValidation, Swagger and Serilog logging',
      primaryLanguage: 'C#',
      url: `https://github.com/${githubOrg}/cdp-dotnet-backend-template`,
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
      ]
    }
  ]
}

export { templatesFixture }
