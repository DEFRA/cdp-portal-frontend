import { config } from '~/src/config/index.js'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/repositories/cdp-portal-frontend
const repositoryFixture = {
  message: 'success',
  repository: {
    id: 'cdp-portal-frontend',
    description: 'The Core Delivery Platform Portal.',
    primaryLanguage: 'JavaScript',
    url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
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
    ],
    topics: ['frontend', 'node', 'cdp', 'service']
  }
}

export { repositoryFixture }
