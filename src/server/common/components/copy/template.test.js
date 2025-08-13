import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Copy Component', () => {
  let $copyElem, $copyContentElem

  describe('With default values', () => {
    beforeEach(() => {
      const $component = renderTestComponent('copy', {
        params: {
          content: { id: '78893', text: 'https://aww-yeah.com' }
        }
      })

      $copyElem = $component('[data-testid="app-copy"]').first()
      $copyContentElem = $component('[data-testid="app-copy-content"]').first()
    })

    test('Should render with expected copy button class attributes', () => {
      expect($copyElem.attr('class')).toBe('app-copy js-visible-inline')
    })

    test('Should render with expected copy button title attribute', () => {
      expect($copyElem.attr('title')).toBe('Copy')
    })

    test('Should render with expected copy button data attributes', () => {
      expect($copyElem.attr('data-js')).toBe('app-copy')
      expect($copyElem.attr('data-testid')).toBe('app-copy')
      expect($copyElem.attr('data-content-id')).toBe('78893')
    })

    test('Should render with expected copy icon', () => {
      expect($copyElem.find('[data-testid="app-copy-icon"]')).toHaveLength(1)
    })

    test('Should render with expected content text', () => {
      expect($copyContentElem.text().trim()).toBe('https://aww-yeah.com')
    })
  })

  describe('With html value', () => {
    beforeEach(() => {
      const $component = renderTestComponent('copy', {
        params: {
          content: { id: '947475', html: '<em>https://nice-nice-nice.com</em>' }
        }
      })

      $copyElem = $component('[data-testid="app-copy"]').first()
      $copyContentElem = $component('[data-testid="app-copy-content"]').first()
    })

    test('Should render with expected content text', () => {
      expect($copyContentElem.html().trim()).toBe(
        '<em>https://nice-nice-nice.com</em>'
      )
    })
  })

  describe('With alternative title value', () => {
    beforeEach(() => {
      const $component = renderTestComponent('copy', {
        params: {
          title: 'Text copied!',
          content: {
            id: '56778',
            text: 'https://wonderful.com'
          }
        }
      })

      $copyElem = $component('[data-testid="app-copy"]').first()
      $copyContentElem = $component('[data-testid="app-copy-content"]').first()
    })

    test('Should render with expected copy button title attribute', () => {
      expect($copyElem.attr('title')).toBe('Text copied!')
    })
  })
})
