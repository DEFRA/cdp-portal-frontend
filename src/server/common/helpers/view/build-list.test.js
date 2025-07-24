import { describe, expect, test } from 'vitest'
import { buildList } from './build-list.js'

describe('#buildList', () => {
  test('Should provide expected list', () => {
    expect(buildList(['jim', 'selena', 'frank', 'hannah'])).toBe(
      '<ul class="govuk-list"><li>jim</li><li>selena</li><li>frank</li><li>hannah</li></ul>'
    )
  })
})
