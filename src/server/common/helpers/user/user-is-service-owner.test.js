import {
  userIsServiceOwner,
  userIsServiceOwnerDecorator
} from './user-is-service-owner.js'

describe('#userIsServiceOwner', () => {
  let checkUserIsServiceOwner

  beforeEach(() => {
    const adminScopes = [
      'team:teamOneScope',
      'team:teamTwoScope',
      'team:teamThreeScope'
    ]
    checkUserIsServiceOwner = userIsServiceOwner({
      scope: adminScopes
    })
  })

  test('Should have scope', () => {
    const serviceTeams = ['teamOneScope', 'teamTwoScope']
    expect(checkUserIsServiceOwner(serviceTeams)).toBe(true)
  })

  test('Should not have scope', () => {
    const serviceTeams = ['teamFourScope', 'teamFiveScope']
    expect(checkUserIsServiceOwner(serviceTeams)).toBe(false)
  })
})

describe('#userIsServiceOwnerDecorator', () => {
  let checkUserIsServiceOwnerDecorator

  beforeEach(() => {
    const adminScopes = [
      'team:teamTenScope',
      'team:teamElevenScope',
      'team:teamTwelveScope'
    ]
    checkUserIsServiceOwnerDecorator = userIsServiceOwnerDecorator({
      auth: {
        credentials: {
          scope: adminScopes
        }
      }
    })
  })

  test('With one matching scope. Should return true', async () => {
    const serviceTeams = ['teamFiveScope', 'teamElevenScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeams)).toBe(true)
  })

  test('With multiple matching scopes. Should return true', async () => {
    const serviceTeams = ['teamElevenScope', 'teamTwelveScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeams)).toBe(true)
  })

  test('With no matching scopes. Should return false', async () => {
    const serviceTeamScopes = ['team:teamOneScope', 'team:teamTwoScope']
    expect(await checkUserIsServiceOwnerDecorator(serviceTeamScopes)).toBe(
      false
    )
  })
})
