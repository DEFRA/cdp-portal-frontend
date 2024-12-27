import { buildList } from '~/src/server/common/helpers/view/build-list.js'

describe('#buildList', () => {
  test('Should provide expected list', () => {
    expect(buildList(['jim', 'selena', 'frank', 'hannah'])).toBe(
      '<ul class="govuk-list"><li>jim</li><li>selena</li><li>frank</li><li>hannah</li></ul>'
    )
  })
})
