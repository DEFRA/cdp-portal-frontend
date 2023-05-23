import { sortBy } from '~/src/common/helpers/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt', 'desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt', 'asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ deployedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })
})
