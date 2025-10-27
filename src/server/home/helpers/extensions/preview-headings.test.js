import { Marked } from 'marked'
import { load } from 'cheerio'

import { previewHeadingsExtension } from './preview-headings.js'

describe('#previewHeadings', () => {
  const previewHeadersExtension = previewHeadingsExtension(
    '44-all-the-things-section'
  )
  let testMarked

  beforeEach(() => {
    testMarked = new Marked({
      pedantic: false,
      gfm: true,
      extensions: [previewHeadersExtension]
    })
  })

  test('Should render expected h1 heading', async () => {
    const html = await testMarked.parse('# Introduction')
    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')

    expect($heading).toHaveLength(1)
    expect($anchor.attr('href')).toBe('44-all-the-things-section')
    expect($anchor.attr('class')).toBe('app-link app-link--text-colour')
    expect($anchor.text()).toBe('Introduction')
  })

  test('Should render heading, containing markdown, as expected', async () => {
    const html = await testMarked.parse('# 44: All the `things` section')

    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')
    const $code = $anchor.find('code')

    expect($heading).toHaveLength(1)
    expect($anchor.attr('href')).toBe('44-all-the-things-section')
    expect($anchor.attr('class')).toBe('app-link app-link--text-colour')
    expect($anchor.text()).toBe('44: All the things section')
    expect($anchor.html()).toBe('44: All the <code>things</code> section')
    expect($code.text()).toBe('things')
  })

  test('Should render expected h2 heading with an internal page anchor', async () => {
    const html = await testMarked.parse('## Details')
    const $html = load(html)
    const $headingH2 = $html('h2')
    const $anchor = $headingH2.find('a')

    expect($headingH2).toHaveLength(1)
    expect($anchor.attr('href')).toBe('#details')
    expect($anchor.attr('class')).toBe('heading-link')
    expect($anchor.text()).toBe('Details')
  })
})
