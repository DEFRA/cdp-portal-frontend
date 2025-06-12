import {
  renderServiceTag,
  serviceTags,
  validServiceTags
} from '~/src/server/admin/tags/helpers/service-tags.js'

describe('service-tags', () => {
  test('schema only allows valid keys', () => {
    expect(validServiceTags.validate('tier-1').error).toBeFalsy()
    expect(validServiceTags.validate('live').error).toBeFalsy()
    expect(validServiceTags.validate('invalid tag').error).not.toBeFalsy()
  })
})

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
