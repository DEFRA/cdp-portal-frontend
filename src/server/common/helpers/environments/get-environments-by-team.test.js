import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'

describe('#getEnvironmentsByTeam', () => {
  test('Should return expected environments for admin team', () => {
    const teams = [{ teamId: 'adminGroupId' }]
    const oidcAdminGroupId = 'adminGroupId'
    const result = getEnvironmentsByTeam(teams, oidcAdminGroupId)
    expect(result).toEqual({
      infraDev: 'infra-dev',
      management: 'management',
      dev: 'dev',
      test: 'test',
      perfTest: 'perf-test',
      extTest: 'ext-test',
      prod: 'prod'
    })
  })

  test('Should return expected environments for non-admin team', () => {
    const teams = [{ teamId: 'nonAdminGroupId' }]
    const oidcAdminGroupId = 'adminGroupId'
    const result = getEnvironmentsByTeam(teams, oidcAdminGroupId)

    expect(result).toEqual({
      dev: 'dev',
      perfTest: 'perf-test',
      prod: 'prod',
      test: 'test'
    })
  })

  test('Should fallback to tenant environments when teams array is empty', () => {
    const teams = []
    const oidcAdminGroupId = 'adminGroupId'
    const result = getEnvironmentsByTeam(teams, oidcAdminGroupId)

    expect(result).toEqual({
      dev: 'dev',
      perfTest: 'perf-test',
      prod: 'prod',
      test: 'test'
    })
  })
})
