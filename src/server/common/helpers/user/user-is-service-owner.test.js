import {
  userIsServiceOwner,
  userIsServiceOwnerDecorator
} from '~/src/server/common/helpers/user/user-is-service-owner'

describe('#userIsServiceOwner', () => {
  let checkUserIsServiceOwner

  beforeEach(() => {
    const adminScopes = ['teamOneScope', 'teamTwoScope', 'teamThreeScope']
    checkUserIsServiceOwner = userIsServiceOwner({
      scope: adminScopes
    })
  })

  test('Should have scope', () => {
    const serviceTeamScopes = ['teamOneScope', 'teamTwoScope']
    expect(checkUserIsServiceOwner(serviceTeamScopes)).toBe(true)
  })

  test('Should not have scope', () => {
    const serviceTeamScopes = ['teamFourScope', 'teamFiveScope']
    expect(checkUserIsServiceOwner(serviceTeamScopes)).toBe(false)
  })
})

describe('#userIsServiceOwnerDecorator', () => {
  let checkUserIsServiceOwnerDecorator

  beforeEach(() => {
    const adminScopes = ['teamTenScope', 'teamElevenScope', 'teamTwelveScope']
    checkUserIsServiceOwnerDecorator = userIsServiceOwnerDecorator({
      getUserSession: jest.fn().mockResolvedValue({
        scope: adminScopes
      })
    })
  })

  test('With one matching scope. Should return true', async () => {
    const serviceTeamScopes = ['teamFiveScope', 'teamElevenScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeamScopes)).toBe(true)
  })

  test('With multiple matching scopes. Should return true', async () => {
    const serviceTeamScopes = ['teamElevenScope', 'teamTwelveScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeamScopes)).toBe(true)
  })

  test('With no matching scopes. Should return false', async () => {
    const serviceTeamScopes = ['teamOneScope', 'teamTwoScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeamScopes)).toBe(
      false
    )
  })
})
