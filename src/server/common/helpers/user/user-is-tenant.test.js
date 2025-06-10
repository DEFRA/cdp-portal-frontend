import { userIsTenant } from '~/src/server/common/helpers/user/user-is-tenant.js'

describe('#userIsTenant', () => {
  test('Should have scope', () => {
    const checkUserIsTenant = userIsTenant({
      scope: [],
      isTenant: true
    })
    expect(checkUserIsTenant).toBe(true)
  })

  test('Should not have scope', () => {
    const checkUserIsTenant = userIsTenant({
      scope: [],
      isTenant: false
    })
    expect(checkUserIsTenant).toBe(false)
  })
})
