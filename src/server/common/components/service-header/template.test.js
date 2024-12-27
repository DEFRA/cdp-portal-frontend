import { renderTestComponent } from '~/test-helpers/component-helpers.js'

describe('Service Header Component', () => {
  let $header

  beforeEach(() => {
    $header = renderTestComponent('service-header', {
      serviceName: 'Totally MEGA service portal',
      serviceUrl: '/'
    })
  })

  test('Should render app header component', () => {
    expect($header('[data-testid="app-service-header"]')).toHaveLength(1)
  })

  test('Should contain expected service name', () => {
    expect(
      $header('[data-testid="app-service-header-service-name"]').text().trim()
    ).toBe('Totally MEGA service portal')
  })

  test('Should have expected service url link', () => {
    expect(
      $header('[data-testid="app-service-header-service-name"]').attr('href')
    ).toBe('/')
  })
})
