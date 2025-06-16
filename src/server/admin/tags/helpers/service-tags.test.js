import {
  renderServiceTag,
  serviceTags
} from '~/src/server/admin/tags/helpers/service-tags.js'

describe('renderServiceTag', () => {
  test('produces html tag when give a tag name', () => {
    const html = renderServiceTag('live')
    expect(html).toContain(serviceTags.live.displayName)
  })

  test('produces html tag when give a tag object', () => {
    const html = renderServiceTag(serviceTags.live)
    expect(html).toContain(serviceTags.live.displayName)
  })
})
