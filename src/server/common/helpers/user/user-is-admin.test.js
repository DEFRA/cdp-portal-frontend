import { userIsAdmin } from '~/src/server/common/helpers/user/user-is-admin.js'

describe('#userIsAdmin', () => {
  test('Should have scope', () => {
    const checkUserIsAdmin = userIsAdmin({
      scope: [],
      isAdmin: true
    })
    expect(checkUserIsAdmin).toBe(true)
  })

  test('Should not have scope', () => {
    const checkUserIsAdmin = userIsAdmin({
      scope: [],
      isAdmin: false
    })
    expect(checkUserIsAdmin).toBe(false)
  })
})
