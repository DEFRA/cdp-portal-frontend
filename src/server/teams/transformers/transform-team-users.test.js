import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamUsers } from '~/src/server/teams/transformers/transform-team-users'

describe('#transformTeamUsers', () => {
  test('Should provide expected team users transformation', () => {
    expect(transformTeamUsers(teamFixture, false)).toEqual([
      {
        action: {},
        content: {
          text: 'The Terminator'
        },
        name: 'The Terminator',
        userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
      },
      {
        action: {},
        content: {
          text: 'RoboCop'
        },
        name: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      }
    ])
  })

  test('Should provide expected "hasTeamScope" team users transformation', () => {
    expect(transformTeamUsers(teamFixture, true)).toEqual([
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive" formaction="/teams/aabe63e7-87ef-4beb-a596-c810631fc474/remove-member/0ddadf17-beaf-4aef-a415-ca044dbdd18d">Remove</button>'
        },
        content: {
          text: 'The Terminator'
        },
        name: 'The Terminator',
        userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
      },
      {
        action: {
          html: '<button class="govuk-button app-button app-button--small app-button--destructive" formaction="/teams/aabe63e7-87ef-4beb-a596-c810631fc474/remove-member/1398fa86-98a2-4ee8-84bb-2468cc71d0ec">Remove</button>'
        },
        content: {
          text: 'RoboCop'
        },
        name: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      }
    ])
  })
})
