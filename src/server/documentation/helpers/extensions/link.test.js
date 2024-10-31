import { load } from 'cheerio'

import { linkExtension } from '~/src/server/documentation/helpers/extensions/link.js'

describe('#linkExtension', () => {
  test('Should render an external link', () => {
    const html = linkExtension.renderer({
      href: 'https://example.com',
      text: 'Example'
    })
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('https://example.com')
    expect($link.attr('target')).toBe('_blank')
    expect($link.attr('rel')).toBe('noopener noreferrer')
  })

  test('Should render a portal link', () => {
    const html = linkExtension.renderer({
      href: 'https://portal/home',
      text: 'Home'
    })
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('https://portal/home')
    expect($link.text()).toBe('Home')
    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()
  })

  test('Should render an in page link', () => {
    const html = linkExtension.renderer({
      href: 'in-page/link#section-heading',
      text: 'Section Heading'
    })
    const $html = load(html)
    const $link = $html('a')

    expect($link.attr('href')).toBe('in-page/link#section-heading')
    expect($link.text()).toBe('Section Heading')
    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()
  })
})
