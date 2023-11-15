import {
  userHasTeamScope,
  userHasTeamScopeDecorator
} from '~/src/server/common/helpers/user/user-has-team-scope'

describe('#userHasTeamScope', () => {
  let checkHasTeamScope

  beforeEach(() => {
    checkHasTeamScope = userHasTeamScope({
      scope: ['apple', 'pear', 'banana']
    })
  })

  test('Should have scope', () => {
    expect(checkHasTeamScope('pear')).toEqual(true)
  })

  test('Should not have scope', () => {
    expect(checkHasTeamScope('pineapple')).toEqual(false)
  })
})

describe('#userHasTeamScopeDecorator', () => {
  let checkHasTeamScopeDecorator

  beforeEach(() => {
    checkHasTeamScopeDecorator = userHasTeamScopeDecorator({
      getUserSession: jest.fn().mockResolvedValue({
        scope: ['cat', 'dog', 'cow', 'horse']
      })
    })
  })

  test('Should have scope', async () => {
    expect(await checkHasTeamScopeDecorator('horse')).toEqual(true)
  })

  test('Should not have scope', async () => {
    expect(await checkHasTeamScopeDecorator('volkswagen')).toEqual(false)
  })
})
