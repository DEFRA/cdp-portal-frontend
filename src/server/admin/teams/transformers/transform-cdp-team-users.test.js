import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamUsers } from '~/src/server/admin/teams/transformers/transform-cdp-team-users'

describe('#transformCdpTeamUsers', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformCdpTeamUsers(cdpTeamFixture.team)).toEqual([
      {
        action: {
          html:
            '<button class="govuk-button app-button app-button--small app-button--destructive"' +
            ' formaction="/admin/teams/aabe63e7-87ef-4beb-a596-c810631fc474/remove-member/0ddadf17-beaf-4aef-a415-ca044dbdd18d">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/admin/users/0ddadf17-beaf-4aef-a415-ca044dbdd18d">The Terminator</a>'
        },
        name: 'The Terminator',
        userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
      },
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive" formaction="/admin/teams/aabe63e7-87ef-4beb-a596-c810631fc474/remove-member/1398fa86-98a2-4ee8-84bb-2468cc71d0ec">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/admin/users/1398fa86-98a2-4ee8-84bb-2468cc71d0ec">RoboCop</a>'
        },
        name: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      }
    ])
  })
})
