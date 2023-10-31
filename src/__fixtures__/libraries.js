import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// NOTE we don't yet have libraries, but when we do they may look like this
// Response from portalBackendApi/libraries?team=cdp-platform
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
    }
  ]
}

export { librariesFixture }
