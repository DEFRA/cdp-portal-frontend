import { markdown } from '~/src/server/common/helpers/markdown'

describe('#markdown', () => {
  test('renders titles with ids so they can be linked to', () => {
    expect(markdown.render(`# test`)).toBe(
      '<h1 id="test" tabindex="-1">test</h1>\n'
    )
    expect(markdown.render(`## test`)).toBe(
      '<h2 id="test" tabindex="-1">test</h2>\n'
    )
    expect(markdown.render(`### test`)).toBe(
      '<h3 id="test" tabindex="-1">test</h3>\n'
    )
    expect(markdown.render(`#### test`)).toBe(
      '<h4 id="test" tabindex="-1">test</h4>\n'
    )
  })
})
