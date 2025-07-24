import { describe, expect, test } from 'vitest'
import { removeNil } from './remove-nil.js'

describe('#removeNil', () => {
  test('Should provide object without nil properties', () => {
    expect(removeNil({ one: null, two: undefined, three: 'Oh Yeah!' })).toEqual(
      { three: 'Oh Yeah!' }
    )
  })
})
