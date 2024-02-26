import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.deployments.sort(sortBy('deployedAt'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updatedAt: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updatedAt: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updatedAt: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updatedAt: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(
      deploymentsFixture.deployments.sort(sortBy('deployedAt', 'desc'))
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updatedAt: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updatedAt: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updatedAt: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updatedAt: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(
      deploymentsFixture.deployments.sort(sortBy('deployedAt', 'asc'))
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updatedAt: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updatedAt: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updatedAt: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updatedAt: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })
})
