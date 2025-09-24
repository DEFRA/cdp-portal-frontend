export const teamRepositoriesFixture = {
  libraries: [
    {
      id: 'cdp-libraries',
      description: 'Git repository for cdp-libraries',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-libraries',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2025-06-11T15:04:55+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'repository', 'library']
    }
  ],
  services: [
    {
      id: 'cdp-portal-backend',
      description: 'Git repository for service cdp-portal-backend',
      primaryLanguage: 'C#',
      url: 'https://github.com/DEFRA/cdp-portal-backend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2023-08-21T11:12:06+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['backend', 'cdp', 'dotnet', 'service']
    },
    {
      id: 'cdp-portal-frontend',
      description:
        'The Core Delivery Platform Portal. A Node.js frontend application built with Hapi.js. Helping Defra teams to create, deploy, run and monitor applications on the Core Delivery Platform.',
      primaryLanguage: 'HTML',
      url: 'https://github.com/DEFRA/cdp-portal-frontend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2023-04-12T17:16:48+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'frontend', 'node', 'service']
    },
    {
      id: 'cdp-self-service-ops',
      description:
        'Core delivery platform Self Service Ops Node.js Backend.  This Api provides automation for service creation, deployment and future mutations sent from the Core Development Portal.',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-self-service-ops',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2023-05-12T13:33:54+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['backend', 'cdp', 'node', 'service']
    },
    {
      id: 'cdp-uploader',
      description: 'Git repository for service cdp-uploader',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-uploader',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2024-03-14T15:28:20+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'frontend', 'node', 'service']
    },
    {
      id: 'cdp-user-service-backend',
      description: 'Git repository for service cdp-user-service-backend',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-user-service-backend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2023-08-08T08:40:23+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['backend', 'cdp', 'node', 'service']
    }
  ],
  templates: [
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
          teamId: 'platform',
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
          teamId: 'platform',
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
          teamId: 'platform',
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
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'template', 'test-suite', 'journey']
    },
    {
      id: 'cdp-node-prototype-template',
      description: 'Git repository for cdp-node-prototype-template',
      primaryLanguage: 'Dockerfile',
      url: 'https://github.com/DEFRA/cdp-node-prototype-template',
      isArchived: false,
      isTemplate: true,
      isPrivate: false,
      createdAt: '2025-07-18T12:04:13+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'repository', 'template', 'prototype']
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
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'repository', 'template', 'test-suite', 'performance']
    }
  ],
  tests: [
    {
      id: 'cdp-portal-journey-tests',
      description: 'Git repository for service cdp-portal-journey-tests',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-portal-journey-tests',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2024-11-27T18:19:23+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'journey', 'test', 'test-suite']
    },
    {
      id: 'cdp-uploader-perf-tests',
      description: 'Git repository for service cdp-uploader-perf-tests',
      primaryLanguage: 'Shell',
      url: 'https://github.com/DEFRA/cdp-uploader-perf-tests',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2024-05-21T16:07:26+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'performance', 'test', 'test-suite']
    },
    {
      id: 'cdp-uploader-smoke-tests',
      description: 'Git repository for service cdp-uploader-smoke-tests',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-uploader-smoke-tests',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2024-05-09T13:00:12+00:00',
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'test', 'test-suite', 'journey']
    }
  ]
}
