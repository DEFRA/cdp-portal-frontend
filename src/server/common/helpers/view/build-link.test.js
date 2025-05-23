import { load } from 'cheerio'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

describe('#buildLink', () => {
  test('Should build expected link', () => {
    const $link = load(
      buildLink({ href: 'https://awesome-cakes.com', text: 'AweSome Cakes' })
    )('a').first()

    expect($link.attr('class')).toBe('app-link')
    expect($link.attr('href')).toBe('https://awesome-cakes.com')
    expect($link.data('testid')).toBe('app-link')
    expect($link.attr('target')).toBe('_blank')
    expect($link.attr('rel')).toBe('noopener noreferrer')
    expect($link.text()).toBe('AweSome Cakes')

    expect($link.toString()).toBe(
      `<a class="app-link" href="https://awesome-cakes.com" target="_blank" rel="noopener noreferrer" data-testid="app-link">AweSome Cakes</a>`
    )
  })

  test('Should build expected link when only href supplied', () => {
    const $link = load(buildLink({ href: 'https://awesome-cakes.com' }))(
      'a'
    ).first()

    expect($link.attr('class')).toBe('app-link')
    expect($link.attr('href')).toBe('https://awesome-cakes.com')
    expect($link.data('testid')).toBe('app-link')
    expect($link.attr('target')).toBe('_blank')
    expect($link.attr('rel')).toBe('noopener noreferrer')
    expect($link.text()).toBe('https://awesome-cakes.com')

    expect($link.toString()).toBe(
      `<a class="app-link" href="https://awesome-cakes.com" target="_blank" rel="noopener noreferrer" data-testid="app-link">https://awesome-cakes.com</a>`
    )
  })

  test('Should build expected internal link', () => {
    const $link = load(
      buildLink({
        href: 'https://awesome-cakes.com',
        text: 'Click here its yummy!',
        newTab: false
      })
    )('a').first()

    expect($link.attr('class')).toBe('app-link')
    expect($link.attr('href')).toBe('https://awesome-cakes.com')
    expect($link.data('testid')).toBe('app-link')
    expect($link.text()).toBe('Click here its yummy!')

    expect($link.attr('target')).toBeUndefined()
    expect($link.attr('rel')).toBeUndefined()

    expect($link.toString()).toBe(
      `<a class="app-link" href="https://awesome-cakes.com" data-testid="app-link">Click here its yummy!</a>`
    )
  })
})
