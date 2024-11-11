import { Marked } from 'marked'
import { load } from 'cheerio'

import { linkExtension } from '~/src/server/documentation/helpers/extensions/link.js'

describe('#linkExtension', () => {
  let testMarked

  beforeEach(() => {
    testMarked = new Marked({
      pedantic: false,
      gfm: true,
      extensions: [linkExtension]
    })
  })

  test('Should render an external link', async () => {
    const html = await testMarked.parse('[Example](https://example.com)')
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('https://example.com')
    expect($link.attr('target')).toBe('_blank')
    expect($link.attr('rel')).toBe('noopener noreferrer')
  })

  test('Should render a portal link', async () => {
    const html = await testMarked.parse('[Home](https://portal/home)')
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('https://portal/home')
    expect($link.text()).toBe('Home')
    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()
  })

  test('Should render an in page link', async () => {
    const html = await testMarked.parse(
      '[Section Heading](in-page/link#section-heading)'
    )
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('in-page/link#section-heading')
    expect($link.text()).toBe('Section Heading')
    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()
  })

  test('Should render a link, containing markdown, as expected', async () => {
    const html = await testMarked.parse(
      '[Section `with highlight` link](https://portal/home)'
    )
    const $html = load(html)
    const $link = $html('a')
    const $code = $link.find('code')

    expect($link.attr('href')).toBe('https://portal/home')
    expect($link.text()).toBe('Section with highlight link')
    expect($link.html()).toBe('Section <code>with highlight</code> link')
    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()

    expect($code.text()).toBe('with highlight')
  })
})
