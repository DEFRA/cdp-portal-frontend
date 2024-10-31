import {
  userIsTeamMember,
  userIsTeamMemberDecorator
} from '~/src/server/common/helpers/user/user-is-team-member.js'

describe('#userIsTeamMember', () => {
  let checkHasTeamScope

  beforeEach(() => {
    checkHasTeamScope = userIsTeamMember({
      scope: ['apple', 'pear', 'banana']
    })
  })

  test('Should have scope', () => {
    expect(checkHasTeamScope('pear')).toBe(true)
  })

  test('Should not have scope', () => {
    expect(checkHasTeamScope('pineapple')).toBe(false)
  })
})

describe('#userIsTeamMemberDecorator', () => {
  let checkHasTeamScopeDecorator

  beforeEach(() => {
    checkHasTeamScopeDecorator = userIsTeamMemberDecorator({
      getUserSession: jest.fn().mockResolvedValue({
        scope: ['cat', 'dog', 'cow', 'horse']
      })
    })
  })

  test('Should have scope', async () => {
    expect(await checkHasTeamScopeDecorator('horse')).toBe(true)
  })

  test('Should not have scope', async () => {
    expect(await checkHasTeamScopeDecorator('volkswagen')).toBe(false)
  })
})
