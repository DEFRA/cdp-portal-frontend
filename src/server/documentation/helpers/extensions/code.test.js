import { Marked } from 'marked'
import { load } from 'cheerio'

import { codeExtension } from './code.js'

describe('#codeExtension', () => {
  let testMarked

  beforeEach(() => {
    testMarked = new Marked({
      pedantic: false,
      gfm: true,
      extensions: [codeExtension]
    })
  })

  test('Should render expected code block', async () => {
    const html = await testMarked.parse("``` const example = 'exampleOne' ```")
    const $html = load(html)

    const $code = $html('code')

    expect($code).toHaveLength(1)
    expect($code.text()).toBe(`const example = 'exampleOne'`)
  })

  test('Should render code with mermaid class', async () => {
    const html = await testMarked.parse(
      'Here is a mermaid diagram:\n\n```mermaid \n\ngraph TD\nA[Client] --> B[Load\nBalancer]\nB --> C[Server01]\nB --> D[Server02]\n```'
    )

    const $html = load(html)
    const $pre = $html('pre')

    expect($pre).toHaveLength(1)
    expect($pre.attr('class')).toEqual('mermaid')
  })
})
