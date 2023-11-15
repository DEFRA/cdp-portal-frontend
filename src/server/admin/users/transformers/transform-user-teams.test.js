import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { transformUserTeams } from '~/src/server/admin/users/transformers/transform-user-teams'

describe('#transformUserTeams', () => {
  test('Should provide expected user teams transformation', () => {
    expect(transformUserTeams(cdpUserFixture.user)).toEqual([
      {
        content: {
          html: '<a class="app-link" href="/admin/teams/9e068bb9-1452-426e-a4ca-2e675a942a89">Bees</a>'
        },
        name: 'Bees',
        teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89'
      },
      {
        content: {
          html: '<a class="app-link" href="/admin/teams/6ed0400a-a8a0-482b-b45a-109634cd1274">Trees-and-forests</a>'
        },
        name: 'Trees-and-forests',
        teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274'
      }
    ])
  })
})
