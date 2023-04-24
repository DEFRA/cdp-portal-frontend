import { renderComponent } from '~/test-helpers/component-helpers'

describe('Time Component', () => {
  let $time

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    $time = renderComponent('time', {
      datetime: '2023-04-11T15:11:31.722Z'
    })
  })

  test('Should render app time component', () => {
    expect($time('[data-test-id="app-time"]').length).toEqual(1)
  })

  test('Should contain expected rendered date', () => {
    expect($time('[data-test-id="app-time"]').text().trim()).toEqual(
      '3:11 pm on Tuesday 11th April 2023'
    )
  })

  test('Should have expected datetime attribute', () => {
    expect($time('[data-test-id="app-time"]').attr('datetime')).toEqual(
      '2023-04-11T15:11:31.722Z'
    )
  })
})
