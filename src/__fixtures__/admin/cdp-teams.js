// Response from userServiceBackend/teams
import { scopes } from '@defra/cdp-validation-kit'

const cdpTeamsFixture = [
  {
    name: 'Fish-and-octopus',
    createdAt: '2023-08-24T14:20:35.819Z',
    updatedAt: '2023-08-30T08:08:53.634Z',
    description: 'All things sealife 🐠',
    teamId: 'fish-and-octopus',
    github: 'fisheries',
    users: [
      {
        id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
        name: 'RoboCop'
      },
      {
        id: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
        name: 'Mumm-ra'
      }
    ],
    serviceCodes: ['FO'],
    alertEmailAddresses: ['robocop@robocop.com'],
    scopes: []
  },
  {
    name: 'Trees-and-forests',
    description: 'All things 🌳',
    createdAt: '2023-08-24T14:51:30.164Z',
    updatedAt: '2023-08-29T17:55:13.293Z',
    teamId: 'trees-and-forests',
    github: 'trees-and-forests',
    users: [
      {
        id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        name: 'B. A. Baracus'
      }
    ],
    serviceCodes: ['TF'],
    alertEmailAddresses: [],
    scopes: [scopes.externalTest]
  },
  {
    name: 'Bees',
    description: 'All about 🐝 and insects and flowers',
    createdAt: '2023-08-24T15:55:11.751Z',
    updatedAt: '2023-08-30T06:29:42.216Z',
    teamId: 'bees',
    github: 'bees',
    users: [
      {
        id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        name: 'B. A. Baracus'
      },
      {
        id: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
        name: 'Mumm-ra'
      }
    ],
    serviceCodes: ['BEE'],
    alertEmailAddresses: ['bee@bee.com'],
    scopes: [scopes.externalTest]
  },
  {
    name: 'Platform',
    description: 'The platform team',
    createdAt: '2023-08-24T15:55:11.751Z',
    updatedAt: '2023-08-30T06:29:42.216Z',
    teamId: 'platform',
    github: 'cdp-platform',
    users: [
      {
        id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        name: 'B. A. Baracus'
      }
    ],
    serviceCodes: ['CDP'],
    alertEmailAddresses: ['platform@platform.com', 'platops@platops.com'],
    scopes: [scopes.breakGlass, scopes.externalTest]
  }
]

export { cdpTeamsFixture }
