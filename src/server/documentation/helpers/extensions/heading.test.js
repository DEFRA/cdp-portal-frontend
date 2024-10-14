import { load } from 'cheerio'

import { headingExtension } from '~/src/server/documentation/helpers/extensions/heading'

describe('#headingExtension', () => {
  test('Should render expected heading', () => {
    const html = headingExtension.renderer({ text: 'Introduction', depth: 1 })
    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')

    expect($heading.text()).toContain('Introduction')

    expect($anchor.attr('href')).toBe('#introduction')
    expect($anchor.text()).toBe('#')
  })
})
