import {
  userIsMemberOfATeam,
  userIsMemberOfATeamDecorator
} from '~/src/server/common/helpers/user/user-is-member-of-a-team'

describe('#userIsMemberOfATeam', () => {
  let checkIsMemberOfATeam

  beforeEach(() => {
    checkIsMemberOfATeam = userIsMemberOfATeam({
      scope: ['lychee', 'mango', 'papaya']
    })
  })

  test('Should have scope', () => {
    expect(checkIsMemberOfATeam(['pear', 'mango'])).toEqual(true)
  })

  test('Should not have scope', () => {
    expect(checkIsMemberOfATeam(['date', 'pear'])).toEqual(false)
  })
})

describe('#userIsMemberOfATeamDecorator', () => {
  let checkIsMemberOfATeamScopeDecorator

  beforeEach(() => {
    checkIsMemberOfATeamScopeDecorator = userIsMemberOfATeamDecorator({
      getUserSession: jest.fn().mockResolvedValue({
        scope: ['rabbit', 'sheep', 'bull', 'deer']
      })
    })
  })

  test('Should have scope', async () => {
    expect(await checkIsMemberOfATeamScopeDecorator(['horse', 'deer'])).toEqual(
      true
    )
  })

  test('Should have scope', async () => {
    expect(await checkIsMemberOfATeamScopeDecorator(['bull', 'sheep'])).toEqual(
      true
    )
  })

  test('Should not have scope', async () => {
    expect(
      await checkIsMemberOfATeamScopeDecorator(['eagle', 'raven'])
    ).toEqual(false)
  })
})
