import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Banner Component', () => {
  let $banner

  describe('Success Banner', () => {
    beforeEach(() => {
      $banner = renderTestComponent('banner', {
        type: 'success',
        text: 'Well done!'
      })('[data-testid="app-banner"]').first()
    })

    test('Should render with expected text content', () => {
      expect(
        $banner.find('[data-testid="app-banner-content"]').text()
      ).toContain('Well done!')
    })
  })

  test('Should render with expected type class content', () => {
    expect($banner.attr('class')).toContain('app-banner--success')
  })

  describe('Info Banner', () => {
    beforeEach(() => {
      $banner = renderTestComponent('banner', {
        type: 'info',
        text: 'Today is Wednesday'
      })('[data-testid="app-banner"]').first()
    })

    test('Should render with expected text content', () => {
      expect(
        $banner.find('[data-testid="app-banner-content"]').text()
      ).toContain('Today is Wednesday')
    })

    test('Should render with expected type class content', () => {
      expect($banner.attr('class')).toContain('app-banner--info')
    })
  })

  describe('Error Banner', () => {
    beforeEach(() => {
      $banner = renderTestComponent('banner', {
        type: 'error',
        text: 'Something has gone terribly wrong!'
      })('[data-testid="app-banner"]').first()
    })

    test('Should render with expected text content', () => {
      expect(
        $banner.find('[data-testid="app-banner-content"]').text()
      ).toContain('Something has gone terribly wrong!')
    })

    test('Should render with expected type class content', () => {
      expect($banner.attr('class')).toContain('app-banner--error')
    })
  })
})
