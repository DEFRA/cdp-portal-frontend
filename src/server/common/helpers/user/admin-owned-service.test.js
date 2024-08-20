import { adminOwnedService } from '~/src/server/common/helpers/user/admin-owned-service'

describe('#adminOwnedService', () => {
  test('Should return true if teamScopes includes oidcAdminGroupId', () => {
    const teamScopes = ['scope1', 'scope2', 'adminGroupId']
    const oidcAdminGroupId = 'adminGroupId'

    const result = adminOwnedService(teamScopes, oidcAdminGroupId)

    expect(result).toBe(true)
  })

  test('Should return false if teamScopes does not include oidcAdminGroupId', () => {
    const teamScopes = ['scope1', 'scope2']
    const oidcAdminGroupId = 'adminGroupId'

    const result = adminOwnedService(teamScopes, oidcAdminGroupId)

    expect(result).toBe(false)
  })

  test('Should return false if teamScopes is empty', () => {
    const teamScopes = []
    const oidcAdminGroupId = 'adminGroupId'

    const result = adminOwnedService(teamScopes, oidcAdminGroupId)

    expect(result).toBe(false)
  })
})
