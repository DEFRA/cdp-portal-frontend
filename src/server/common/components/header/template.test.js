import { renderTestComponent } from '~/test-helpers/component-helpers.js'

describe('Header Component', () => {
  let $header

  beforeEach(() => {
    $header = renderTestComponent('header', {
      serviceName: 'Totally MEGA service portal',
      serviceUrl: '/'
    })
  })

  test('Should render app header component', () => {
    expect($header('[data-testid="app-header"]')).toHaveLength(1)
  })

  test('Should contain expected service name', () => {
    expect(
      $header('[data-testid="app-header-service-name"]').text().trim()
    ).toBe('Totally MEGA service portal')
  })

  test('Should have expected service url link', () => {
    expect(
      $header('[data-testid="app-header-service-name"]').attr('href')
    ).toBe('/')
  })
})
