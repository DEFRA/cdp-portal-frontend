// Response from userServiceBackend/teams/aabe63e7-87ef-4beb-a596-c810631fc474
import { scopes } from '@defra/cdp-validation-kit'

const cdpTeamFixture = {
  name: 'Platform',
  description: 'The team that runs the platform',
  createdAt: '2023-09-28T12:52:14.673Z',
  updatedAt: '2023-10-03T11:11:31.085Z',
  github: 'cdp-platform',
  teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
  serviceCodes: ['CDP'],
  alertEmailAddresses: ['alerts@cdp.com'],
  alertEnvironments: ['infra-dev', 'management'],
  users: [
    {
      id: '0ddadf17-beaf-4aef-a415-ca044dbdd18d',
      name: 'The Terminator'
    },
    {
      id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'RoboCop'
    }
  ]
}

const cdpTeamBeesFixture = {
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
    }
  ],
  serviceCodes: ['BEE'],
  alertEmailAddresses: ['bee@bee.com'],
  scopes: [scopes.externalTest]
}

export { cdpTeamFixture, cdpTeamBeesFixture }
