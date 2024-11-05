import { load } from 'cheerio'

import { headingExtension } from '~/src/server/documentation/helpers/extensions/heading.js'

describe('#headingExtension', () => {
  test('Should render expected heading', () => {
    const html = headingExtension.renderer({ text: 'Introduction', depth: 1 })
    const $html = load(html)
    const $heading = $html('h1')
    const $anchor = $heading.find('a')

    expect($heading).toHaveLength(1)
    expect($anchor.attr('href')).toBe('#introduction')
    expect($anchor.text()).toBe('Introduction')
  })
})
