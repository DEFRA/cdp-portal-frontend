// Response from userServiceBackend/teams
const cdpTeamsFixture = {
  message: 'success',
  teams: [
    {
      name: 'Fish-and-octopus',
      createdAt: '2023-08-24T14:20:35.819Z',
      updatedAt: '2023-08-30T08:08:53.634Z',
      description: 'All things sealife 🐠',
      teamId: '087d4a80-002b-48cf-a7d3-aa60b67784f0',
      github: 'fisheries',
      users: [
        {
          displayName: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
          id: 'RoboCop'
        },
        {
          displayName: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
          id: 'Mumm-ra'
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
      teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274',
      github: 'trees-and-forests',
      users: [
        {
          displayName: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
          id: 'B. A. Baracus'
        }
      ],
      serviceCodes: ['TF'],
      alertEmailAddresses: [],
      scopes: ['externalTest']
    },
    {
      name: 'Bees',
      description: 'All about 🐝 and insects and flowers',
      createdAt: '2023-08-24T15:55:11.751Z',
      updatedAt: '2023-08-30T06:29:42.216Z',
      teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89',
      github: 'bees',
      users: [
        {
          displayName: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
          id: 'B. A. Baracus'
        },
        {
          displayName: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
          id: 'Mumm-ra'
        }
      ],
      serviceCodes: ['BEE'],
      alertEmailAddresses: ['bee@bee.com'],
      scopes: ['externalTest']
    },
    {
      name: 'Platform',
      description: 'The platform team',
      createdAt: '2023-08-24T15:55:11.751Z',
      updatedAt: '2023-08-30T06:29:42.216Z',
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      github: 'cdp-platform',
      users: [
        {
          displayName: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
          id: 'B. A. Baracus'
        }
      ],
      serviceCodes: ['CDP'],
      alertEmailAddresses: ['platform@platform.com', 'platops@platops.com'],
      scopes: ['breakGlass', 'externalTest']
    }
  ]
}

export { cdpTeamsFixture }
