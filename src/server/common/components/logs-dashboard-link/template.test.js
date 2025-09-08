import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Logs Dashboard Link Component', () => {
  let logsDashBoardLink

  describe('With default attributes', () => {
    beforeEach(() => {
      const $component = renderTestComponent('logs-dashboard-link', {
        params: {
          serviceName: 'cdp-portal-frontend',
          environment: 'management'
        }
      })

      logsDashBoardLink = $component(
        '[data-testid="app-logs-dashboard-link"]'
      ).first()
    })

    test('Should render with expected href attribute', () => {
      expect(logsDashBoardLink.attr('href')).toBe(
        'https://logs.management.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/cdp-portal-frontend'
      )
    })

    test('Should render with expected text', () => {
      expect(logsDashBoardLink.text().trim()).toBe(
        'https://logs.management.cdp-int.defra.cloud'
      )
    })
  })

  describe('With extended attributes', () => {
    beforeEach(() => {
      const $component = renderTestComponent('logs-dashboard-link', {
        params: {
          text: 'logs',
          classes: 'app-link--underline app-link--text-colour',
          serviceName: 'cdp-portal-frontend',
          environment: 'management'
        }
      })

      logsDashBoardLink = $component(
        '[data-testid="app-logs-dashboard-link"]'
      ).first()
    })

    test('Should render with expected custom class names', () => {
      expect(logsDashBoardLink.attr('class')).toContain(
        'app-link--underline app-link--text-colour'
      )
    })

    test('Should render with expected custom text', () => {
      expect(logsDashBoardLink.text().trim()).toBe('logs')
    })
  })
})
