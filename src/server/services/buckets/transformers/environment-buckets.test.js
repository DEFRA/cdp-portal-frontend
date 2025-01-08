import { environmentBuckets } from '~/src/server/services/buckets/transformers/environment-buckets.js'
import { bucketsWithPendingFixture } from '~/src/__fixtures__/buckets/buckets.js'

describe('#environmentBuckets', () => {
  test('Should return expected environment bucket transformation', () => {
    const result = environmentBuckets(bucketsWithPendingFixture)

    expect(result.buckets).toEqual([
      'a_lower_case_bucket',
      'SERVICE_BUCKET',
      'z_ordered_bucket'
    ])
    expect(result.isBucketsSetup).toBe(true)
  })

  test('Should return null if buckets is null', () => {
    const result = environmentBuckets(null, [])

    expect(result.buckets).toBeUndefined()
    expect(result.isBucketsSetup).toBe(false)
  })
})
