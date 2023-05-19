import { sortBy } from '~/src/app/common/helpers/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.sort(sortBy('timestamp'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('timestamp', 'desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('timestamp', 'asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' })
      ])
    )
  })
})
