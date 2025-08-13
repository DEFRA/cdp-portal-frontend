import { buildList } from './build-list.js'

describe('#buildList', () => {
  test('Should provide expected list', () => {
    expect(buildList({ items: ['jim', 'selena', 'frank', 'hannah'] })).toBe(
      '<ul class="govuk-list"><li>jim</li><li>selena</li><li>frank</li><li>hannah</li></ul>'
    )
  })
  test('Should apply extra classes', () => {
    expect(
      buildList({
        items: ['fred', 'dave', 'atticus', 'gerald'],
        classes: ['govuk-list--bullet']
      })
    ).toBe(
      '<ul class="govuk-list govuk-list--bullet"><li>fred</li><li>dave</li><li>atticus</li><li>gerald</li></ul>'
    )
  })
})
