import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// TODO update fixture once we have libraries
// Response from portalBackendApi/libraries/cdp-node-frontend-library
const libraryFixture = {
  message: 'success',
  library: {
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
}

export { libraryFixture }
