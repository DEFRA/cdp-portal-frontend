// Response from userServiceBackend/users
const cdpUsersFixture = {
  message: 'success',
  users: [
    {
      name: 'B. A. Baracus',
      email: 'B.A.Baracus@defradev.onmicrosoft.com',
      github: 'BABaracus',
      defraVpnId: '345345-345345',
      defraAwsId: 'FGHyu-232342-234234',
      createdAt: '2023-08-23T16:17:57.883Z',
      updatedAt: '2023-08-24T15:31:52.259Z',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      teams: [
        {
          teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89',
          name: 'Bees'
        },
        {
          teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274',
          name: 'Trees-and-forests'
        }
      ]
    },
    {
      name: 'RoboCop',
      email: 'RoboCop@defradev.onmicrosoft.com',
      github: 'RoboCop',
      defraVpnId: '4563656356-53673567356',
      defraAwsId: 'Fsdfgsfdgsdrt-45345-2345',
      createdAt: '2023-06-23T16:17:57.883Z',
      updatedAt: '2023-06-24T15:31:52.259Z',
      userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
      teams: [
        {
          teamId: '087d4a80-002b-48cf-a7d3-aa60b67784f0',
          name: 'Fish-and-octopus'
        }
      ]
    },
    {
      name: 'Mumm-ra',
      email: 'Mumm-ra@defradev.onmicrosoft.com',
      github: 'Mumm-ra',
      defraVpnId: 'srtewr-34234234',
      defraAwsId: 'sdfsdfg0324-24324-234',
      createdAt: '2023-07-19T16:17:57.883Z',
      updatedAt: '2023-07-22T15:31:52.259Z',
      userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
      teams: [
        {
          teamId: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
          name: 'Fish-and-octopus'
        }
      ]
    }
  ]
}

export { cdpUsersFixture }
