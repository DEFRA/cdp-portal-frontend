import { sortBy } from '~/src/server/common/helpers/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.sort(sortBy('updatedAt'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('updatedAt', 'desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('updatedAt', 'asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' }),
        expect.objectContaining({ updatedAt: '2023-05-18T21:54:12Z' })
      ])
    )
  })
})
