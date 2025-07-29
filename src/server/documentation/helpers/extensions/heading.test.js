import { Marked } from 'marked'
import { load } from 'cheerio'

import { headingExtension } from './heading.js'

describe('#headingExtension', () => {
  let testMarked

  beforeEach(() => {
    testMarked = new Marked({
      pedantic: false,
      gfm: true,
      extensions: [headingExtension]
    })
  })

  test('Should render expected heading', async () => {
    const html = await testMarked.parse('# Introduction')
    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')

    expect($heading).toHaveLength(1)
    expect($anchor.attr('href')).toBe('#introduction')
    expect($anchor.text()).toBe('Introduction')
  })

  test('Should render heading, containing markdown, as expected', async () => {
    const html = await testMarked.parse('# 44: All the `things` section')

    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')
    const $code = $anchor.find('code')

    expect($heading).toHaveLength(1)
    expect($anchor.attr('href')).toBe('#44-all-the-things-section')
    expect($anchor.text()).toBe('44: All the things section')
    expect($anchor.html()).toBe('44: All the <code>things</code> section')
    expect($code.text()).toBe('things')
  })
})
