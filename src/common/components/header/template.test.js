import { renderComponent } from '~/test-helpers/component-helpers'

describe('Header Component', () => {
  let $header

  beforeEach(() => {
    $header = renderComponent('header', {
      serviceName: 'Totally MEGA service portal',
      serviceUrl: '/'
    })
  })

  test('Should render app header component', () => {
    expect($header('[data-test-id="app-header"]').length).toEqual(1)
  })

  test('Should contain expected service name', () => {
    expect($header('[data-test-id="app-header-link"]').text().trim()).toEqual(
      'Totally MEGA service portal'
    )
  })

  test('Should have expected service url link', () => {
    expect($header('[data-test-id="app-header-link"]').attr('href')).toEqual(
      '/'
    )
  })
})
