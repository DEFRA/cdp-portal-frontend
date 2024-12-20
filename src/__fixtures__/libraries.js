import { config } from '~/src/config/config.js'

const githubOrg = config.get('githubOrg')

// TODO update fixture once we have libraries
// Response from portalBackendApi/libraries
const librariesFixture = {
  message: 'success',
  libraries: [
    {
      id: 'cdp-node-frontend-library',
      description: 'Core delivery platform npm library',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-npm-library`,
      isArchived: false,
      isLibrary: true,
      isPrivate: true,
      createdAt: '2023-04-26T15:27:09+00:00',
      teams: ['cdp-platform']
    },
    {
      id: 'cdp-node-auth-library',
      description: 'Core delivery platform auth library',
      primaryLanguage: 'JavaScript',
      url: `https://github.com/${githubOrg}/cdp-auth-library`,
      isArchived: false,
      isLibrary: true,
      isPrivate: true,
      createdAt: '2022-04-26T15:27:10+00:00',
      teams: ['cdp-platform']
    }
  ]
}

export { librariesFixture }
