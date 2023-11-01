import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// Response from portalBackendApi/templates?team=cdp-platform
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
      isPrivate: true,
      createdAt: '2023-04-26T15:27:09+00:00',
      teams: ['cdp-platform']
    },
    {
      id: 'cdp-node-backend-template',
      description: 'Core delivery platform Node.js Backend Template',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-node-backend-template`,
      isArchived: false,
      isTemplate: true,
      isPrivate: true,
      createdAt: '2023-06-20T12:10:50+00:00',
      teams: ['cdp-platform']
    }
  ]
}

export { templatesFixture }
