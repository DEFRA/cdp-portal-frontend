import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Info Component', () => {
  let $info

  describe('With text content', () => {
    beforeEach(() => {
      $info = renderTestComponent('info', {
        text: 'Something interesting'
      })('[data-testid="app-info"]').first()
    })

    test('Should render with expected text content', () => {
      expect($info.find('[data-testid="app-info-content"]').text().trim()).toBe(
        'Something interesting'
      )
    })
  })

  describe('With html content', () => {
    beforeEach(() => {
      $info = renderTestComponent('info', {
        html: '<em>Something fascinating with markup!</em>'
      })('[data-testid="app-info"]').first()
    })

    test('Should render with expected text content', () => {
      expect($info.find('[data-testid="app-info-content"]').html().trim()).toBe(
        '<em>Something fascinating with markup!</em>'
      )
    })
  })
})
