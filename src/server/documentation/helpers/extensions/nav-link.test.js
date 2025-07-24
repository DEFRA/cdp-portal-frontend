import { beforeEach, describe, expect, test } from 'vitest'
import { Marked } from 'marked'
import { load } from 'cheerio'

import { navLinkExtension } from './nav-link.js'

describe('#navLinkExtension', () => {
  let testMarked

  beforeEach(() => {
    testMarked = new Marked({
      pedantic: false,
      gfm: true
    })
  })

  const markdownLink = '[A link to some of our docs](/how-to/develop)'

  test('Should mark matching link as active', async () => {
    testMarked.use({ extensions: [navLinkExtension('how-to/develop')] })

    const html = await testMarked.parse(markdownLink)
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('/documentation/how-to/develop')
    expect($link.attr('class')).toBe('app-link is-active')
  })

  test('Should not mark non-matching link as active', async () => {
    testMarked.use({
      extensions: [navLinkExtension('how-to/do-awesome-cake-things')]
    })

    const html = await testMarked.parse(markdownLink)
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('/documentation/how-to/develop')
    expect($link.attr('class')).toBe('app-link')
  })
})
