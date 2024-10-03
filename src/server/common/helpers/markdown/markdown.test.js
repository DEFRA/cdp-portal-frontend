import { markdown } from '~/src/server/common/helpers/markdown/markdown'

describe('#docs', () => {
  test('renders titles with ids so they can be linked to', () => {
    expect(markdown.parse(`# test`)).toBe('<h1 id="test">test</h1>\n')
    expect(markdown.parse(`## test`)).toBe('<h2 id="test">test</h2>\n')
    expect(markdown.parse(`### test`)).toBe('<h3 id="test">test</h3>\n')
    expect(markdown.parse(`#### test`)).toBe('<h4 id="test">test</h4>\n')
  })
})
