import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Tag Component', () => {
  let $tag

  describe('On render', () => {
    beforeEach(() => {
      $tag = renderTestComponent('tag', {
        text: 'Not today',
        classes: 'additional-class',
        attributes: {
          'data-testid': 'app-tag'
        }
      })('[data-testid="app-tag"]').first()
    })

    test('Should render element', () => {
      expect($tag).not.toBeNull()
    })

    test('Should have expected text', () => {
      expect($tag.text().trim()).toEqual('Not today')
    })

    test('Should render with expected additional class', () => {
      expect($tag.attr('class')).toContain('additional-class')
    })

    test('Should render with expected default data test id', () => {
      expect($tag.attr('data-testid')).toContain('app-tag')
    })
  })
})
