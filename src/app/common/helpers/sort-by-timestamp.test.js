import { sortByTimestamp } from '~/src/app/common/helpers/sort-by-timestamp'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortByTimestamp', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.sort(sortByTimestamp())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.sort(sortByTimestamp('desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.sort(sortByTimestamp('asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ deployedAt: '2023-04-10T11:41:09.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T14:40:02.242Z' }),
        expect.objectContaining({ deployedAt: '2023-04-11T15:11:31.722Z' })
      ])
    )
  })
})
