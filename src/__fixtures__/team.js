import { config } from '~/src/config/index.js'

const githubOrg = config.get('githubOrg')

const teamFixture = {
  name: 'Platform',
  description: 'The team that runs most of the things 💪🏻',
  createdAt: '2023-09-28T12:52:14.673Z',
  updatedAt: '2023-10-03T11:11:31.085Z',
  github: 'cdp-platform',
  teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
  users: [
    {
      userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d',
      name: 'The Terminator'
    },
    {
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'RoboCop'
    }
  ],
  repositories: [
    {
      id: 'cdp-portal-backend',
      description: 'Git repository for service cdp-portal-backend',
      primaryLanguage: 'C#',
      url: `https://github.com/${githubOrg}/cdp-portal-backend`,
      isArchived: false,
      isTemplate: false,
      isPrivate: true,
      createdAt: '2023-08-21T11:12:06+00:00',
      teams: ['cdp-platform']
    },
    {
      id: 'cdp-portal-frontend',
      description: 'The Core Delivery Platform Portal.',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      isArchived: false,
      isTemplate: false,
      isPrivate: true,
      createdAt: '2023-04-12T17:16:48+00:00',
      teams: ['cdp-platform']
    }
  ],
  templates: [
    {
      id: 'cdp-node-backend-template',
      description: 'Core delivery platform Node.js Backend Template.',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-node-backend-template`,
      isArchived: false,
      isTemplate: true,
      isPrivate: true,
      createdAt: '2023-06-20T12:10:50+00:00',
      teams: ['cdp-platform']
    },
    {
      id: 'cdp-node-frontend-template',
      description: 'Core delivery platform Node.js Frontend Template.',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-node-frontend-template`,
      isArchived: false,
      isTemplate: true,
      isPrivate: true,
      createdAt: '2023-04-26T15:27:09+00:00',
      teams: ['cdp-platform']
    }
  ],
  libraries: []
}

export { teamFixture }
