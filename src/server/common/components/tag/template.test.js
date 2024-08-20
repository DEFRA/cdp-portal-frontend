import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Tag Component', () => {
  let $component
  let $tag
  let $link

  describe('On render', () => {
    beforeEach(() => {
      $component = renderTestComponent('tag', {
        text: 'Not today',
        classes: 'additional-class',
        attributes: {
          'data-testid': 'app-tag'
        },
        url: 'https://apples.com',
        newWindow: true,
        link: {
          classes: 'app-link-without-underline'
        }
      })

      $tag = $component('[data-testid="app-tag"]').first()
      $link = $component('[data-testid="app-entity-link"]').first()
    })

    test('Should render element', () => {
      expect($tag).not.toBeNull()
    })

    test('Should have expected text', () => {
      expect($tag.text().trim()).toBe('Not today')
    })

    test('Should render with expected additional class', () => {
      expect($tag.attr('class')).toContain('additional-class')
    })

    test('Should render with expected default data test id', () => {
      expect($tag.attr('data-testid')).toContain('app-tag')
    })

    test('Should contain expected href', () => {
      expect($link.attr('href')).toBe('https://apples.com')
    })

    test('Should contain expected target', () => {
      expect($link.attr('target')).toBe('_blank')
    })

    test('Should contain expected link classes', () => {
      expect($link.attr('class')).toContain('app-link-without-underline')
    })
  })
})
