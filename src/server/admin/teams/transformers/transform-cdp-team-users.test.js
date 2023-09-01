import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamUsers } from '~/src/server/admin/teams/transformers/transform-cdp-team-users'

describe('#transformCdpTeamUsers', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformCdpTeamUsers(cdpTeamFixture.team)).toEqual([
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive"formaction="/cdp-portal-frontend/admin/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd/remove-user/014ee26b-e738-4bcc-9621-a5289dba7351">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/cdp-portal-frontend/admin/users/014ee26b-e738-4bcc-9621-a5289dba7351">Darth, Vader</a>'
        },
        name: 'Darth, Vader',
        userId: '014ee26b-e738-4bcc-9621-a5289dba7351'
      },
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive"formaction="/cdp-portal-frontend/admin/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd/remove-user/1398fa86-98a2-4ee8-84bb-2468cc71d0ec">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/cdp-portal-frontend/admin/users/1398fa86-98a2-4ee8-84bb-2468cc71d0ec">RoboCop</a>'
        },
        name: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      },
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive"formaction="/cdp-portal-frontend/admin/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd/remove-user/02af05d1-2bbb-4094-a847-b9eddcf0d6bb">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/cdp-portal-frontend/admin/users/02af05d1-2bbb-4094-a847-b9eddcf0d6bb">Roger, Rabbit</a>'
        },
        name: 'Roger, Rabbit',
        userId: '02af05d1-2bbb-4094-a847-b9eddcf0d6bb'
      },
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive"formaction="/cdp-portal-frontend/admin/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd/remove-user/0ddadf17-beaf-4aef-a415-ca044dbdd18d">Remove</button>'
        },
        content: {
          html: '<a class="app-link" href="/cdp-portal-frontend/admin/users/0ddadf17-beaf-4aef-a415-ca044dbdd18d">The Terminator</a>'
        },
        name: 'The Terminator',
        userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
      }
    ])
  })
})
