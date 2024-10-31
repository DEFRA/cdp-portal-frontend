import {
  userIsMemberOfATeam,
  userIsMemberOfATeamDecorator
} from '~/src/server/common/helpers/user/user-is-member-of-a-team.js'

describe('#userIsMemberOfATeam', () => {
  let checkIsMemberOfATeam

  beforeEach(() => {
    const adminScopes = ['teamOneScope', 'teamTwoScope', 'teamThreeScope']
    checkIsMemberOfATeam = userIsMemberOfATeam({
      scope: adminScopes
    })
  })

  test('Should have scope', () => {
    const teamScopes = ['teamOneScope', 'teamTwoScope']
    expect(checkIsMemberOfATeam(teamScopes)).toBe(true)
  })

  test('Should not have scope', () => {
    const teamScopes = ['teamTenScope', 'teamElevenScope']
    expect(checkIsMemberOfATeam(teamScopes)).toBe(false)
  })
})

describe('#userIsMemberOfATeamDecorator', () => {
  let checkIsMemberOfATeamScopeDecorator

  beforeEach(() => {
    const adminScopes = ['teamTenScope', 'teamElevenScope', 'teamTwelveScope']
    checkIsMemberOfATeamScopeDecorator = userIsMemberOfATeamDecorator({
      getUserSession: jest.fn().mockResolvedValue({
        scope: adminScopes
      })
    })
  })

  test('With one matching scope. Should return true', async () => {
    const serviceTeamScopes = ['teamZeroScope', 'teamElevenScope']
    expect(await checkIsMemberOfATeamScopeDecorator(serviceTeamScopes)).toBe(
      true
    )
  })

  test('With multiple matching scopes. Should return true', async () => {
    const serviceTeamScopes = [
      'teamTenScope',
      'teamElevenScope',
      'teamTwelveScope'
    ]
    expect(await checkIsMemberOfATeamScopeDecorator(serviceTeamScopes)).toBe(
      true
    )
  })

  test('With no matching scopes. Should return false', async () => {
    const serviceTeamScopes = [
      'teamTwoScope',
      'teamThreeScope',
      'teamFourScope'
    ]
    expect(await checkIsMemberOfATeamScopeDecorator(serviceTeamScopes)).toBe(
      false
    )
  })
})
